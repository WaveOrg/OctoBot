const Discord = require("discord.js")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        client.emit("guildMemberAdd", message.mentions.members.first())
        client.emit("guildMemberRemove", message.mentions.members.first())
    },

    config: {
        command: "emit",
        aliases: [],
        description: " test",
        usage: `cool`,
        admin: true
    }
}