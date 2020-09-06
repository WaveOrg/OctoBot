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

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `8D`."));

        var currentFilters = player.getQueue(message.guild.id).filters || {}
        if(currentFilters["8D"] == true) {
            currentFilters["8D"] = false
            player.setFilters(message.guild.id, currentFilters)
        } else {
            currentFilters["8D"] = true
            player.setFilters(message.guild.id, currentFilters)
        }

        msg.edit(InfoEmbed("", `<:yes:752247197436870666> 8D has been ${currentFilters["8D"]? "enabled" : "disabled"}`))

    },

    config: {
        command: "8d",
        aliases: [],
        description: "Add 8D audio.",
        permissions: [],
        usage: `8d`
    }
}