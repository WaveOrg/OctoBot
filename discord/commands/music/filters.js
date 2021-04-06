const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed, RedEmbed } = require("../../../utils/utils");
const ms = require('ms')
const bands = require("../../music/structures/Bands")
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

        message.channel.send(InfoEmbed("🎧 Music Filters", `Active Filters: ${Object.keys(queue.filterManager.activeFilters).map(t => `\`${t}\``).join(', ')}`))
        
    },

    config: {
        command: "filters",
        aliases: [],
        description: "Shows active filters.",
        permissions: [],
        usage: `filters`,
        premium: false,
        requiresModules: [modules.MUSIC]
    }
}