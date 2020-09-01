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
                const details = song.getCurrentDetails()
                const l = Date.now() - song.getPos();
                const vl = parseInt(details.videoDetails.lengthSeconds)

                const progressBarMax = 10;
                const barProgress = ( 10 * l ) / vl

                console.log(barProgress)

                console.log(utils.generateProgressBar(barProgress, progressBarMax, `${ms(l)}/${ms(parseFloat(vl) * 1000)}`))

                message.channel.send(InfoEmbed("🎧 Current Song", `${details.videoDetails.title}\n${utils.generateProgressBar(l, 10, `${ms(l)}/${ms(parseFloat(vl) * 1000)}`)}`).setThumbnail(details.videoDetails.thumbnail.thumbnails[4].url))
            } else {
                message.channel.send(ErrorEmbed("It's a little quiet there, play a song then use this command!"))
            }
        } else {
            message.channel.send(ErrorEmbed("You must be in a VC!"))
        }
    },

    config: {
        command: "nowplaying",
        aliases: ["np"],
        description: "Shows the current song.",
        permissions: [],
        usage: `{{PREFIX}}nowplaying`
    }
}