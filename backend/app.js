"use strict";

require("dotenv").config()

const fs = require("fs").promises;
const path = require("path");
const io = require("socket.io")({
    path: "/ws"
});

const { logger } = require("../launcher.globals");
const utils = require("./utils/utils")
const SocketRequest = require("./core/SocketRequest")

const routes = [];

let shardingManager = null;

module.exports = (manager) => {
    shardingManager = manager
} 

loadRouteDir().then(() => {
    // app.use((req, res) => {
    //     utils.sendBadRequest(res, { message: "Invalid request" })
    // })
})

// app.use((req, res, next) => {
//     logger.logBackend(`${req.method} on ${req.path}`)
//     next();
// })

io.on("connection", socket => {
    logger.logBackend(`Connection from ${socket.handshake.address}`)
    routes.forEach(route => socket.on(route.path, (payload) => route.handler(new SocketRequest(socket, route.path, JSON.parse(JSON.stringify(payload))))))
})

io.listen(8080)
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