const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed, cleanTitleForGenius, cutStringButAtNewLineUnderCharacterLimit } = require("../../../utils/utils");
const ms = require('ms')
const { modules } = require("../../../database/constants")

const { getLyrics } = require('genius-lyrics-api');
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

        getLyrics({ 
            ...config.apis.genius,
            title: cleanTitleForGenius(queue.np.title, queue.np.author),
            artist: queue.np.author,
            optimizeQuery: true
        })
            .then(text => {
                if(text.length > 2048) {
                    const parts = cutStringButAtNewLineUnderCharacterLimit(text, 2048);
                    paginationEmbed(message, parts.map((p, i) => InfoEmbed(`[${++i}/${parts.length}] 📜 Lyrics for "${queue.np.title}"`, p)));
                } else {
                    message.channel.send(InfoEmbed(`📜 Lyrics for "${queue.np.title}"`, text))
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