const Discord = require("discord.js")
const { audioPlayers } = require("../../../globals");
const { ErrorEmbed, InfoEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        
        if(!message.member.voice.channelID) return message.channel.send(ErrorEmbed("<:no:750451799609311412> You're not in a VC!").setTitle("").setFooter("").setTimestamp(""))

        if(audioPlayers.has(message.member.voice.channel.id)) {
            const song = audioPlayers.get(message.member.voice.channel.id)

            if(!args[0]) return message.channel.send(InfoEmbed("🔊 Current Volume", `The current volume is ${song.getCurrentVolume()}`))

            if(isNaN(args[0])) return message.channel.send(ErrorEmbed("<:no:750451799609311412> That's not a number!").setTitle("").setFooter("").setTimestamp(""))
            if (parseInt(args[0]) > 100 || parseInt(args[0]) <= 0) return message.channel.send(ErrorEmbed("<:no:750451799609311412> Please select a number between 1 - 100.").setTitle("").setFooter("").setTimestamp(""))
            song.setVolume(parseInt(args[0])/100)

            message.channel.send(InfoEmbed("🔊 Volume Changed", `Volume set to \`${args[0]}%\``))
        } else {
            message.channel.send(ErrorEmbed("<:no:750451799609311412> Nothing is playing silly!").setTitle("").setFooter("").setTimestamp(""))
        }
    },

    config: {
        command: "volume",
        aliases: ["setvolume"],
        description: "Set the volume",
        permissions: [],
        usage: `{{PREFIX}}volume <0-100>`
    }
}