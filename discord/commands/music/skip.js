const Discord = require("discord.js")
const { utils, logger, audioPlayers } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ms = require('ms')

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(message.member.voice.channelID) {
            if(audioPlayers.has(message.member.voice.channel.id)) {
                const song = audioPlayers.get(message.member.voice.channel.id)
                
                song.skip()

                message.channel.send(InfoEmbed("⏩ Skipped", `Song Skipped`).setThumbnail())
            } else {
                message.channel.send(ErrorEmbed("<:no:750451799609311412> Nothing is playing silly!").setTitle("").setFooter("").setTimestamp(""))
            }
        } else {
            message.channel.send(ErrorEmbed("<:no:750451799609311412> You must be in a VC!").setTitle("").setFooter("").setTimestamp(""))
        }
    },

    config: {
        command: "skip",
        aliases: ["s"],
        description: "Skips the current song.",
        permissions: [],
        usage: `skip`
    }
}