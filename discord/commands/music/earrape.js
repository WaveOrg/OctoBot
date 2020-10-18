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

        if(player.getQueue(message.guild.id).player.state.volume > 200) {
            const loading = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `Earrape`."));
            
            player.changeVolume(message.guild.id, 100)
            await player.getQueue(message.guild.id).toggleFilter(bands.earrape);

           loading.edit(InfoEmbed("", `<:yes:752247197436870666> Earrape has been disabled.`))
        } else {
            const msg = await message.channel.send(RedEmbed("⚠ Warning ⚠", "Earrape may cause hearing damage, hearing loss, damaged equipment, and more. Use at your own risk, we are not responsible for any damages caused. React with a ✅ to enable this filter.").setFooter("10 seconds to react."));
        
            await msg.react('✅')
            
            const reactions = await msg.awaitReactions((a,u) => a.emoji.name == '✅' && !u.bot, { max: 1, time: 10000 })

            const loading = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `Earrape`."));

            if(reactions.first().emoji.name == '✅') {
                await player.getQueue(message.guild.id).toggleFilter(bands.earrape)
                player.changeVolume(message.guild.id, 220)
                loading.edit(InfoEmbed("", `<:yes:752247197436870666> Earrape has been enabled.`))
            } 
        }
        
    },

    config: {
        command: "earrape",
        aliases: ['makemyearshurt'],
        description: "Add earrape to the current song.",
        permissions: [],
        usage: `earrape`,
        premium: true,
        requiresModules: [modules.MUSIC]
    }
}