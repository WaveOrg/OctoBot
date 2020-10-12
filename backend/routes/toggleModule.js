const Discord = require("discord.js");
const verifyUser = require("../middleware/verifyUser");
const canAccessGuild = require("../middleware/canAccessGuild");
const { guildOptionsOf } = require("../../utils/dbUtils");
const { modules } = require("../../database/constants");

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
        const module = req.payload.module;
        if(!Object.values(modules).includes(module)) return req.respondBadRequest("Invalid request")

        const guildOptions = guildOptionsOf(guild.id);
        await guildOptions.toggleModule(module);

        req.respondOk({ state: await guildOptions.isModuleEnabled(module) })
    },

    middleware: [verifyUser, (req, next) => { if(!req.payload.module) return req.respondBadRequest("Invalid request"); else next() }, canAccessGuild],
    path: "toggleModule"
}