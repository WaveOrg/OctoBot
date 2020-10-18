const Discord = require("discord.js");
const verifyUser = require("../../middleware/verifyUser");
const canAccessGuild = require("../../middleware/canAccessGuild");
const { guildOptionsOf } = require("../../../utils/dbUtils");
const { modules } = require("../../../database/constants");
const { shardingManager } = require("../../../launcher.globals");

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
        const guild = req.guild;

        const guildOptions = guildOptionsOf(guild.id);
        const enabled = await guildOptions.isModuleEnabled(modules.MUSIC);
        const module = Object.entries(modules).find(([key, value]) => value === modules.MUSIC);
        const moduleData = {
            keyword: module[1],
            enabled
        }
        if(!enabled) return req.respondOk({ module: moduleData })
        const shardData = await shardingManager.shards.get(req.shardId).eval(`(() => {
            const path = require("path");
            const { player } = require(path.resolve(process.cwd(), "./globals"));
            const queue = player.queues.get("${req.guild.id}")
            if(!queue) return { playing: false };
            return { playing: true, paused: queue.player.paused, queue }
        })()`)

        if(shardData.queue) delete shardData.queue["player"]

        req.respondOk({ module: moduleData, ...shardData })
    },

    middleware: [verifyUser, canAccessGuild],
    path: "modules/music"
}