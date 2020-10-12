const Discord = require("discord.js");
const verifyUser = require("../middleware/verifyUser");
const canAccessGuild = require("../middleware/canAccessGuild");
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
        const prefix = req.payload.prefix;

        const guildOptions = guildOptionsOf(guild.id);
        const currentPrefix = await guildOptions.getPrefix();
        if(currentPrefix === prefix) return req.respondOk({ prefix });

        await guildOptions.setPrefix(prefix);
        req.respondOk({ prefix })
    },

    middleware: [verifyUser, (req, next) => { if(!req.payload.prefix) return req.respondBadRequest("Invalid request"); else next() }, canAccessGuild],
    path: "updatePrefix"
}