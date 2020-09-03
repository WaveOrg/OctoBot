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
                const l = (Date.now() - song.getPos()) / 1000;
                const vl = parseInt(details.videoDetails.lengthSeconds)

                const barProgress = Math.floor(utils.scale(l, 0, vl, 0, 10))

                message.channel.send(InfoEmbed("[Now Playing]", `${details.videoDetails.title}\n\n${utils.generateProgressBar(barProgress, 10, `${ms(l * 1000)}/${ms(parseFloat(vl) * 1000)}`)}`).setThumbnail(details.videoDetails.thumbnail.thumbnails[details.videoDetails.thumbnail.thumbnails.length - 1].url))
            } else {
                message.channel.send(ErrorEmbed("<:no:750451799609311412> Nothing is playing silly!").setTitle("").setFooter("").setTimestamp(""))
            }
        } else {
            message.channel.send(ErrorEmbed("<:no:750451799609311412> You must be in a VC with the bot!").setTitle("").setFooter("").setTimestamp(""))
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