const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ms = require('ms')
const { modules } = require("../../../database/constants")

const { getSong } = require('genius-lyrics-api');
const config = require('../../../config.json');
const paginationEmbed = require("discord.js-pagination");

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

        if(!queue.np) return message.channel.send(ErrorEmbed("Nothing is playing!"))

        getSong({ 
            ...config.apis.genius,
            title: queue.np.title,
            artist: queue.np.author,
            optimizeQuery: true
        })
            .then(song => {
                const text = song.lyrics

                if(text.length > 2048) {
                    var parts = [];
                    var i = 0;

                    text.split('\n')
                        .forEach(part => {
                            if((parts[i]?.length ?? 0) + part.length > 2048) 
                                parts[++i] = part
                            else 
                                parts[i] += ('\n' + (part ?? 0));
                        });

                    paginationEmbed(message, parts.map((p, i) => InfoEmbed(`[${++i}/${parts.length}] 📜 Lyrics for "${queue.np.title}"`, p).setURL(song.url)));
                } else {
                    message.channel.send(InfoEmbed(`📜 Lyrics for "${queue.np.title}"`, text).setURL(song.url))
                }

            })
            .catch(err => {
                console.log(err);
                message.channel.send(ErrorEmbed("Unable to find lyrics", `I was unable to find lyrics for "${queue.np.title}"`));
            })
            
    },

    config: {
        command: "lyrics",
        aliases: ["howdoisingthis"],
        description: "Gets the current playing song's lyrics.",
        permissions: [],
        usage: `lyrics`,
        requiresModules: [modules.MUSIC]
    }
}