"use strict";

require("dotenv").config()

const Express = require("express");
const cors = require("cors");
const BodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const app = Express();

const { logger } = require("../launcher.globals");
const utils = require("./utils/utils")

let shardingManager = null;

module.exports = (manager) => {
    shardingManager = manager
} 

app.use(cors());
app.use(BodyParser.json())

loadRouteDir().then(() => {
    app.use((req, res) => {
        utils.sendBadRequest(res, { message: "Invalid request" })
    })
})

app.use((req, res, next) => {
    logger.logBackend(`${req.method} on ${req.path}`)
    next();
})

const listener = app.listen(process.env.EXPRESS_PORT || 8080, () => {
    logger.logBackend(`Now listening on ${listener.address().port}`)
})

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
                if(route.router && route.path) {
                    app.use(route.path, route.router)
                }
            }
        }
    }).catch(err => {
        console.error(err)
    })
}