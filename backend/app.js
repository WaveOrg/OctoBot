"use strict";

require("dotenv").config();

const Discord = require("discord.js");
const Express = require("express");
const BodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const Mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const chalk = require("chalk");
const util = require("../utils/utils");
const { graphqlHTTP } = require("express-graphql");
const GuildOptions = require("../database/models/GuildOptions")

const io = require("socket.io")({
    path: "/ws"
});
const app = Express();

const { mongo } = require("../config.json")
const globals = require("../launcher.globals");
const { logger } = globals;
const SocketRequest = require("./core/SocketRequest")
const { schema, root } = require("./gql/guildSchema");

const { guildOptionsOf } = require("../utils/dbUtils");

const routes = [];

/**
 * @type {Discord.ShardingManager}
 */
let shardingManager = null;

//let schema = null;
//let root = null;

module.exports = (manager) => {
    shardingManager = manager
    globals.shardingManager = manager;
    loadRouteDir()
}

io.on("connection", socket => {
    logger.logBackend(`Connection from ${socket.handshake.address}`)
    routes.forEach(route => socket.on(route.path, (payload) => route.handler(new SocketRequest(socket, route.path, JSON.parse(JSON.stringify(payload))))))
})


app.engine("hbs", handlebars({ extname: ".hbs" }))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))

app.use(BodyParser.urlencoded({ extended: true }))

app.use("/gql", BodyParser(), graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.get("/", async (req, res) => {
    const guilds = (await Promise.all((await GuildOptions.find({}).lean())
        .map(async guild => {
            guild["discordInfo"] = (await shardingManager.broadcastEval(`this.guilds.resolve("${guild.guildId}")`)).filter(it => !!it)[0]
            return guild;
        })))
        .filter(it => !!it["discordInfo"] && !!it["discordInfo"].iconURL)

    res.render("index", {
        guilds,
    })
})

app.get("/:guildId", async (req, res) => {
    const guildId = req.params.guildId;

    const options = await GuildOptions.findOne({ guildId }).lean();
    if(!options) return res.redirect("/");

    const discordInfo = (await shardingManager.broadcastEval(`this.guilds.resolve("${guildId}")`)).filter(it => !!it)[0];
    if(!discordInfo) return res.redirect("/");

    const send = {
        options,
        discordInfo
    };
    if(req.query.error) send["error"] = req.query.error;
    if(req.query.success) send["success"] = req.query.success;
    res.render("guildManage", send)
})

app.post("/:guildId", async (req, res) => {
    const guildId = req.params.guildId;

    const prefix = req.body.prefix;
    if(!prefix) return res.redirect(`/${guildId}`);

    if(prefix.length > 32) return res.redirect(`/${guildId}?error=Prefix length above 32`);

    const options = guildOptionsOf(guildId)
    await options.setPrefix(prefix);

    res.redirect(`/${guildId}?success=Changes have been saved`);
})

Mongoose.connect(`mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(async () => {
        logger.logBackend(`Connected to MongoDB at ${chalk.green(mongo.host)} (${chalk.gray(await util.resolveDomain(mongo.host))}). Using database ${chalk.green(mongo.database)}.`)
    }).catch(console.error);

io.listen(8080)
app.listen(80)
logger.logBackend(`Now listening on ${8080}`)

/**
 * 
 * @param {String} dir
 */
async function loadRouteDir() {
    const dir = "./backend/routes"
    await fs.readdir(dir).then(async files => {
        for(let file of files) {
            const stat = await fs.stat(`${dir}/${file}`)
            if(stat.isDirectory()) {
                return loadRouteDir(`${dir}/${file}`);
            } else if(file.endsWith(".js")) {
                const route = require(path.resolve(`${dir}/${file}`))
                if(route.handler && route.path) routes.push(route);
            }
        }
    }).catch(err => {
        console.error(err)
    })
}