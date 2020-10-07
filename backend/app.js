"use strict";

require("dotenv").config()

const Mongoose = require("mongoose");
const chalk = require("chalk");
const util = require("../utils/utils");
const SocketRequest = require("./core/SocketRequest")
const { scanFolderJs } = require("./utils/utils");
const { mongo } = require("../config.json")
const globals = require("../launcher.globals");
const { logger } = globals;

const io = require("socket.io")({
    path: "/ws"
});

const routes = [];

/**
 * 
 * @param {import("discord.js").ShardingManager} manager 
 */
module.exports = (manager) => {
    globals.shardingManager = manager;

    manager.shards.forEach(shard => shard.setMaxListeners(100))
    
    scanFolderJs("./backend/routes", (route) => {
        if(!route.handler || !route.path) return;
        routes.push(route);
        logger.logBackend(`Loaded route ${route.path}${route.middleware ? ` with ${route.middleware.length} middleware` : ""}`)
    })
}

io.on("connection", socket => {
    logger.logBackend(`Connection from ${socket.handshake.address}`)
    routes.forEach(route => {
        socket.on(route.path, async (payload) => {
            const request = new SocketRequest(socket, route.path, JSON.parse(JSON.stringify(payload)));
            const handlers = [route.handler]
            if(route.middleware) handlers.unshift(...route.middleware)

            let currentHandlerIndex = 0;

            async function processHandlers() {
                await handlers[currentHandlerIndex](request, currentHandlerIndex + 1 >= handlers.length ? undefined : function() {
                    currentHandlerIndex++;
                    processHandlers();
                })
            }

            await processHandlers();
        });
    })
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
logger.logBackend(`Now listening on ${8080}`)