const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ms = require('ms')
const { modules } = require("../../../database/constants")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!message.member.voice.channelID) return message.channel.send(ErrorEmbed("You must be in a Voice Channel to do this!"))
        const perms = message.member.voice.channel.permissionsFor(client.user)
        if(!perms.has("CONNECT")) return message.channel.send(ErrorEmbed("I cannot join the voice channel because I am missing the `Connect` permission."))
        if(!perms.has("SPEAK")) return message.channel.send(ErrorEmbed("I play music in the voice channel because I am missing the `Speak` permission."))

        message.member.voice.channel.join()
            .catch(err => {
                message.channel.send(ErrorEmbed("We incountered an unexpected error."))
                logger.error(`Error joining VC, ${message.content} | ${message.author.id}\n${err}`)
            })
            .then(() => {
                message.react('✅')
            })
    },

    config: {
        command: "join",
        aliases: ["connect"],
        description: "Connect to your Voice Channel.",
        permissions: [],
        usage: `join`,
        requiresModules: [modules.MUSIC]
    }
}