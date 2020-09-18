const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
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
        
        if(!player.isPlaying(message.guild.id)) return message.channel.send(ErrorEmbed("Nothing is playing!"))
        if(!args[0] || isNaN(args[0]) || parseInt(args[0]) > 200 || parseInt(args[0]) < 0) return message.channel.send(ErrorEmbed("Usage: " + this.config.usage))

        player.setVolume(message.guild.id, parseInt(args[0]));

        message.channel.send(InfoEmbed("🔊 Volume Set", `The volume is now ${args[0]}!`))

    },

    config: {
        command: "volume",
        aliases: ["thismusicistooloud", "thismusicistooquiet"],
        description: "Sets the volume.",
        permissions: [],
        usage: `volume <0-200>`,
        premium: true
    }
}