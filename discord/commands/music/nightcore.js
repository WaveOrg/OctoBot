const Discord = require("discord.js")
const { player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const { modules } = require("../../../database/constants");
const Bands = require("../../music/structures/Bands");

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

        const enabled = player.getQueue(message.guild.id).filterManager.toggle('nightcore')

        if(enabled.success)
            msg.edit(InfoEmbed("", `<:yes:752247197436870666> Nightcore has been ${enabled.op}`))
        else    
            msg.edit(ErrorEmbed("", `<:no:750451799609311412> ${enabled.err ?? "General failure"}`))


    },

    config: {
        command: "nightcore",
        aliases: [],
        description: "Add nightcore effect.",
        permissions: [],
        usage: `nightcore`,
        premium: true,
        requiresModules: [modules.MUSIC]
    }
}