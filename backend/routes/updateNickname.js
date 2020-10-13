const Discord = require("discord.js");
const verifyUser = require("../middleware/verifyUser");
const canAccessGuild = require("../middleware/canAccessGuild");
const { guildOptionsOf } = require("../../utils/dbUtils");
const { shardingManager } = require("../../launcher.globals");

module.exports = {

    /**
     * 
     * @param {import("../core/SocketRequest")} req 
     */
    async handler(req) {
        /**
         * 
         * @type {Discord.Guild}
         */

        const guild = req.guild;
        const nickname = req.payload.nickname;

        const currentNickname = await shardingManager.shards.get(req.shardId).eval(`this.guilds.resolve("${guild.id}").me.displayName`);
        if(currentNickname === nickname) return req.respondOk({ nickname });

        await shardingManager.shards.get(req.shardId).eval(`(async () => { await this.guilds.resolve("${guild.id}").me.setNickname("${nickname}") })()`)
        req.respondOk({ nickname })
    },

    middleware: [verifyUser, (req, next) => { if(!req.payload.nickname) return req.respondBadRequest("Invalid request"); else next() }, canAccessGuild],
    path: "updateNickname"
}