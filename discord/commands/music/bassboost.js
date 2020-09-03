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
        if (message.member.voice.channelID) {
            if (audioPlayers.has(message.member.voice.channel.id)) {
                const song = audioPlayers.get(message.member.voice.channel.id)

                if (isNaN(args[0])) return message.channel.send(ErrorEmbed("Please use a number to set the bass boost amount!"))
                if (parseInt(args[0]) > 100000 || parseInt(args[0]) < 0) return message.channel.send(ErrorEmbed("Please select a number between 0 - 100"))

                song.bassBoost(parseInt(args[0]))

                message.channel.send(InfoEmbed("🔊 Bass Boost " + (parseInt(args[0]) == 0? "**DISABLED**" : "**ENABLED**") + "!", `Awesomeness set to \`${args[0]}%\` for the next song!`))

            } else {
                console.log("f")
                message.channel.send(ErrorEmbed("<:no:750451799609311412> Nothing is playing silly!").setTitle("").setFooter("").setTimestamp(""))
            }
        } else {
            message.channel.send(ErrorEmbed("<:no:750451799609311412> You must be in a VC!").setTitle("").setFooter("").setTimestamp(""))
        }
    },

    config: {
        command: "bassboost",
        aliases: ["bass", "bb"],
        description: "Bass boost the next song.",
        permissions: [],
        usage: `{{PREFIX}}bassboost`
    }
}