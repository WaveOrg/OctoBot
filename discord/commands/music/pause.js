const Discord = require("discord.js")
const { player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        
        if(!player.isPlaying(message.guild.id)) return message.channel.send(ErrorEmbed("Nothing is playing!"))

        player.setPause(true, message.guild.id);

        message.channel.send(InfoEmbed("⏸ Music Paused", `I have paused the music!`))

    },

    config: {
        command: "pause",
        aliases: [],
        description: "Pauses the current playing song.",
        permissions: [],
        usage: `pause`
    }
}