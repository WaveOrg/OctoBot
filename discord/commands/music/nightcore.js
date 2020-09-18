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

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `Nightcore`."));

        var currentFilters = player.getQueue(message.guild.id).filters || {}
        if(currentFilters["nightcore"] == true) {
            currentFilters["nightcore"] = false
            player.setFilters(message.guild.id, currentFilters)
        } else {
            currentFilters["nightcore"] = true
            player.setFilters(message.guild.id, currentFilters)
        }

        msg.edit(InfoEmbed("", `<:yes:752247197436870666> Nightcore has been ${currentFilters["nightcore"]? "enabled" : "disabled"}`))

    },

    config: {
        command: "nightcore",
        aliases: [],
        description: "Add the nightcore effect.",
        permissions: [],
        usage: `nightcore`,
        premium: true
    }
}