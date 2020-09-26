const Discord = require("discord.js")
const { modules } = require("../../../database/constants")
const GuildOptions = require("../../../database/models/GuildOptions")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        console.log("aaaaaaaaaaaaaaaaaaaa")
    },

    config: {
        command: "cool",
        aliases: [],
        description: "Cooldown test",
        permissions: [],
        usage: `cool`,
        cooldown: { // Optional
            time: 10000, // milliseconds
            premiumBypassable: false // If true, users with premium can bypass the cooldown
        },
        requiresModules: [modules.FUN, modules.TICKETS] // Optional, if set, all modules in an array must be enabled
    }
}