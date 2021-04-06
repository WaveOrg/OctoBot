const Discord = require("discord.js")
const { utils, logger, player } = require("../../../globals");
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
        const progressbar = queue.progressBar();
        const np = queue.np;

        message.channel.send(InfoEmbed("🎧 Now Playing", `\`${progressbar}\` **${ms(Date.now() - queue.start)}/${ms(np.lengthMS)}**\n \n__Song Information:__\nCurrently playing [\`${np.title}\`](${np.link})\nSong Author: \`${np.author}\`\nDuration: \`${np.formattedLength}\`\n \n__Requested By:__ ${!np.requestedBy.id ? "`Unknown`" : `<@${np.requestedBy.id}>`}`))
    },

    config: {
        command: "nowplaying",
        aliases: ["np", "wtfisthissong"],
        description: "Gets the current playing song.",
        permissions: [],
        usage: `nowplaying`,
        requiresModules: [modules.MUSIC]
    }
}