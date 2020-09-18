const Discord = require("discord.js")
const { modules } = require("../../../database/constants")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        client.emit("guildMemberAdd", message.mentions.members.first())
    },

    config: {
        command: "emitguildmemberadd",
        aliases: [],
        description: " test",
        usage: `cool`,
        admin: true
    }
}