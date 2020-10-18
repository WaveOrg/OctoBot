const Discord = require("discord.js");
const verifyUser = require("../../middleware/verifyUser");
const canAccessGuild = require("../../middleware/canAccessGuild");
const { guildOptionsOf } = require("../../../utils/dbUtils");
const { modules } = require("../../../database/constants");
const { shardingManager, logger } = require("../../../launcher.globals");

/**
 * 
 * @type {Map<SocketIO.Socket, Object>}
 */
const listeners = new Map();

setInterval(async () => {
    // Filtering for loop
    for([socket, data] of listeners) {
        if(data.date + 6e5 < Date.now()) {
            listeners.delete(socket);
            socket.emit("musicQueueQuit", {});
        }
    }

    for([socket, data] of listeners) {
        try {
            socket.emit("musicQueueUpdate", { ...(await _gatherData(data)) })
        } catch(e) {
            console.error(e)
            listeners.delete(socket);
            socket.emit("musicQueueQuit", {});
        }
    }
}, 1e4)

async function _gatherData() {
    /**
     * 
     * @type {Discord.Guild}
     */
    const guildId = data.guildId;
    const shardId = data.shardId;

    const guildOptions = guildOptionsOf(guildId);
    const enabled = await guildOptions.isModuleEnabled(modules.MUSIC);
    const module = Object.entries(modules).find(([key, value]) => value === modules.MUSIC);
    const moduleData = {
        keyword: module[1],
        enabled
    }
    if(!enabled) return { module: moduleData }
    const shardData = await shardingManager.shards.get(shardId).eval(`(() => {
        const path = require("path");
        const { player } = require(path.resolve(process.cwd(), "./globals"));
        const queue = player.queues.get("${guildId}")
        if(!queue) return { playing: false };
        return { playing: true, paused: queue.player.paused, queue }
    })()`)

    if(shardData.queue) delete shardData.queue["player"]

    return { module: moduleData, ...shardData }
}

module.exports = {

    /**
     * 
     * @param {import("../../core/SocketRequest")} req 
     */
    async handler(req) {
        /**
         * 
         * @type {Discord.Guild}
         */

        let listening = false;
        if(!req.payload.state) {
            if(listeners.has(req.socket)) listeners.delete(req.socket);
            return req.respondOk({ listening });
        }

        switch(req.payload.state) {
            case "join":
                listeners.set(req.socket, { guildId: req.guild.id, shardId: req.shardId, date: Date.now() });
                listening = true;
                break;
            default:
                if(listeners.has(req.socket)) listeners.delete(req.socket);
                break;
        }

        req.respondOk({ listening })
    },

    middleware: [verifyUser, canAccessGuild],
    path: "modules/listen"
}

module.exports.emitToListeners = async (guildId) => {
    const toEmit = Array.from(listeners.entries()).filter(([_, data]) => data.guildId === guildId);
    for([socket, data] of toEmit) {
        try {
            socket.emit("musicQueueUpdate", { ...(await _gatherData(data)) })
        } catch(e) {
            console.error(e)
            listeners.delete(socket);
            socket.emit("musicQueueQuit", {});
        }
    }
};