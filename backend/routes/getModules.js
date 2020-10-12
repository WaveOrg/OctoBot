const Discord = require("discord.js");
const verifyUser = require("../middleware/verifyUser");
const canAccessGuild = require("../middleware/canAccessGuild");
const { guildOptionsOf } = require("../../utils/dbUtils");
const { modules, unimplementedModules } = require("../../database/constants");

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

        const guildOptions = guildOptionsOf(guild.id);
        const activeModules = await guildOptions.getActiveModules();

        botModules = Object.entries(modules).map(([key, value]) => ({
            keyword: value,
            displayName: key.split(/_/g).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" "),
            enabled: activeModules.includes(value),
            implemented: !unimplementedModules.includes(value)
        }))

        req.respondOk({ modules: botModules })
    },

    middleware: [verifyUser, canAccessGuild],
    path: "getModules"
}