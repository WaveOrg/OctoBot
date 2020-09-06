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

        const progressbar = player.createProgressBar(message.guild.id);
        const np = await player.nowPlaying(message.guild.id);

        message.channel.send(InfoEmbed("🎧 Now Playing", `\`${progressbar.bar}\` **${ms(progressbar.time)}/${ms(np.durationMS)}**\n \n__Song Information:__\nCurrently playing [\`${np.name}\`](${np.url})\nSong Author: \`${np.author}\`\nDuration: \`${np.duration}\`\n \n__Requested By:__ \`${np.requestedBy.tag}\``).setThumbnail(np.thumbnail)
        )

    },

    config: {
        command: "nowplaying",
        aliases: ["np", "wtfisthissong"],
        description: "Gets the current playing song.",
        permissions: [],
        usage: `nowplaying`
    }
}