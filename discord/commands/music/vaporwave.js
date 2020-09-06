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

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `Vaporwave`."));

        var currentFilters = player.getQueue(message.guild.id).filters || {}
        if(currentFilters["vaporwave"] == true) {
            currentFilters["vaporwave"] = false
            player.setFilters(message.guild.id, currentFilters)
        } else {
            currentFilters["vaporwave"] = true
            player.setFilters(message.guild.id, currentFilters)
        }

        message.channel.send(InfoEmbed("", `<:yes:752247197436870666> Vaporwave has been ${currentFilters["vaporwave"]? "enabled" : "disabled"}`))

    },

    config: {
        command: "vaporwave",
        aliases: [],
        description: "Adds a vapour effect to the current song.",
        permissions: [],
        usage: `vaporwave`
    }
}
