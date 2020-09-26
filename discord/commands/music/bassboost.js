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
        if(!args[0] || isNaN(args[0])) return message.channel.send(ErrorEmbed("Usage: `bassboost <amount in dB>`"))
        if(parseInt(args[0]) > 100 || parseInt(args[0]) < -100) return message.channel.send(ErrorEmbed("dB must be between -100 and 100"))

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `BassBoost`."));

        var currentFilters = player.getQueue(message.guild.id).filters || {}

        if(parseInt(args[0]) == 0) {
            currentFilters[this.config.command] = false
            player.setFilters(message.guild.id, currentFilters, 0)
        } else {
            currentFilters[this.config.command] = true
            player.setFilters(message.guild.id, currentFilters, parseInt(args[0]))
        }

        msg.edit(InfoEmbed("", `<:yes:752247197436870666> Bassboost has been ${currentFilters[this.config.command]? "enabled" : "disabled"}`))

    },

    config: {
        command: "bassboost",
        aliases: ["bass"],
        description: "Add bassboost effect.",
        permissions: [],
        usage: `bassboost <boost in dB>`,
        premium: true
    }
}