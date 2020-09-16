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

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `Karaoke`."));

        var currentFilters = player.getQueue(message.guild.id).filters || {}
        if(currentFilters[this.config.command] == true) {
            currentFilters[this.config.command] = false
            player.setFilters(message.guild.id, currentFilters, 0)
        } else {
            currentFilters[this.config.command] = true
            player.setFilters(message.guild.id, currentFilters, parseInt(args[0]) || 20)
        }

        msg.edit(InfoEmbed("", `<:yes:752247197436870666> Karaoke has been ${currentFilters[this.config.command]? "enabled" : "disabled"}`))

    },

    config: {
        command: "karaoke",
        aliases: [],
        description: "Add karaoke effect.",
        permissions: [],
        usage: `karaoke`,
        premium: true
    }
}