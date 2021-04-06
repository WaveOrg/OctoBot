const Discord = require("discord.js")
const { player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ms = require('ms')
const { modules } = require("../../../database/constants");
const { Menu: menu } = require('../../../utils/menu');
const paginationEmbed = require('discord.js-pagination');

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

        const text = `Playing: ${queue.np.title} | ${queue.np.author}\n` + queue.tracks.map((track, i) => {
            return `#${i+1} - ${track.title} | ${track.author}`;
        }).join('\n')

        if(text.length < 2048) {
            message.channel.send(InfoEmbed("📜 Current Queue", text));
        } else {
            var parts = [];
            var i = 0;

            text.split('\n')
                .forEach(part => {
                    if((parts[i]?.length ?? 0) + part.length > 2048) 
                        parts[++i] = part
                    else 
                        parts[i] += ('\n' + (part ?? ''));
                });

            paginationEmbed(message, parts.map((p, i) => InfoEmbed(`[${++i}/${parts.length}] 📜 Current Queue`, p)));
        }

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