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

        var currentFilters = player.getQueue(message.guild.id).filters || {}
        if(currentFilters[this.config.command] == true) {
            currentFilters[this.config.command] = false
            player.setFilters(message.guild.id, currentFilters, 0)
        } else {
            currentFilters[this.config.command] = true
            player.setFilters(message.guild.id, currentFilters, parseInt(args[0]) || 20)
        }

        message.channel.send(InfoEmbed("📢 Filters Set", `Tremolo has been ${currentFilters[this.config.command]? "enabled" : "disabled"}`))

    },

    config: {
        command: "tremolo",
        aliases: [],
        description: "Add tremolo effect.",
        permissions: [],
        usage: `tremolo`
    }
}