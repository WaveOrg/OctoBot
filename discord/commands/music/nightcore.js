const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
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

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `Nightcore`."));

        const filterEnabled = player.getQueue(message.guild.id).toggleFilter()

        msg.edit(InfoEmbed("", `<:yes:752247197436870666> Nightcore has been ${currentFilters["nightcore"]? "enabled" : "disabled"}`))

    },

    config: {
        command: "nightcore",
        aliases: [],
        description: "Add the nightcore effect.",
        permissions: [],
        usage: `nightcore`,
        premium: true,
        requiresModules: [modules.MUSIC]
    }
}