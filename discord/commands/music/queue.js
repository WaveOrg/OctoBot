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

        const queue = player.getQueue(message.guild.id);

        message.channel.send(InfoEmbed("📜 Current Queue", (queue.tracks.map((track, i) => {
            return `#${i+1} - ${track.title} | ${track.author}`;
        }).join('\n'))));

    },

    config: {
        command: "queue",
        aliases: ["whatsongsaregoingtobeplaying"],
        description: "Shows the current queue.",
        permissions: [],
        usage: `queue`
    }
}