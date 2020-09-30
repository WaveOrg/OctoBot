const Discord = require("discord.js");
const { logger } = require("../../../globals");
const { ErrorEmbed, InfoEmbed } = require("../../../utils/utils")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[1] || !message.mentions.channels.first()) 
            return message.channel.send(ErrorEmbed("Usage: `" + this.config.usage + "`"))

        const pollQuestion = args.slice(1).join(" ");
        const channel = message.mentions.channels.first();

        const perms = channel.permissionsFor(client.user);
        if(!perms.has('VIEW_CHANNEL') || !perms.has('SEND_MESSAGES') || !perms.has('EMBED_LINKS') || !perms.has("ADD_REACTIONS"))
            return message.channel.send(ErrorEmbed(`I am missing the proper permissions required for the channel ${channel}.\nI require: \`VIEW CHANNEL\`, \`SEND MESSAGES\`, \`ADD REACTIONS\`, and \`EMBED LINKS\``))

        channel.send(InfoEmbed("Poll", pollQuestion).setFooter(`Sent by ${message.author.tag}`, message.author.avatarURL({ dynamic: true })))
            .then(async msg => {
                await msg.react('✅')
                await msg.react('❌')
            })
            .catch(err => {
                logger.error(`Error on "poll" command (ID: ${message.member.id}, Content: ${message.content})\n${err}`)
                message.channel.send(ErrorEmbed("There was an internal error when trying to perform this command. The error has been logged."))
            })

    },

    config: {
        command: "poll",
        aliases: [],
        description: "Send a poll to a specific channel!",
        permissions: ["ADMINISTRATOR"],
        usage: `poll <#channel> <poll question>`,
    }
}