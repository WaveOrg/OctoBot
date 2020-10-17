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
        if(!message.member.voice.channel) return message.channel.send(ErrorEmbed("You must be in a Voice Channel!"))

        const queue = player.getQueue(message.guild.id);
        queue.player.switchChannel(message.member.voice.channel.id, { selfdeaf: true });
        player.setPause(false, message.guild.id);

        message.channel.send(InfoEmbed("▶ Music Started", `I have resumed the music!`))
    },

    config: {
        command: "rejoin",
        aliases: ['comeback'],
        description: "Rejoins and resumes the current playing song.",
        permissions: [],
        usage: `rejoin`
    }
}