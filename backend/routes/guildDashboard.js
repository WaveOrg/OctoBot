const Discord = require("discord.js");
const verifyUser = require("../middleware/verifyUser");
const canAccessGuild = require("../middleware/canAccessGuild");
const { shardingManager } = require("../../launcher.globals");
const { guildOptionsOf } = require("../../utils/dbUtils");

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

        let channelData = {
            categories: 0,
            channel: 0,
        }

        guild.channels.forEach(channel => {
            switch(channel.type) {
                case "category": channelData.categories++; break;
                default: channelData.channel++; break;
            }
        })

        const prefix = await guildOptionsOf(guild.id).getPrefix()

        req.respondOk({
            region: guild.region,
            userCount: guild.members.size,
            channelCount: channelData.channel,
            categoryCount: channelData.categories,
            nickname: await shardingManager.shards.get(req.shardId).eval(`this.guilds.resolve("${guild.id}").me.nickname`),
            prefix
        })
    },

    middleware: [verifyUser, canAccessGuild],
    path: "guildDashboard"
}