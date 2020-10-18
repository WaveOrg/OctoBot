const Discord = require("discord.js")
const { player } = require("../../../globals");
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
        
        if(!player.isPlaying(message.guild.id)) return message.channel.send(ErrorEmbed("Nothing is playing!"))

        const queue = player.getQueue(message.guild.id);

        message.channel.send(InfoEmbed("📜 Current Queue", `Playing: ${queue.np.title} | ${queue.np.author}\n` + (queue.tracks.map((track, i) => {
            return `#${i+1} - ${track.title} | ${track.author}`;
        }).join('\n'))));

    },

    config: {
        command: "queue",
        aliases: ["whatsongsaregoingtobeplaying"],
        description: "Shows the current queue.",
        permissions: [],
        usage: `queue`,
        requiresModules: [modules.MUSIC]
    }
}