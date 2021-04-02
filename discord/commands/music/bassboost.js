const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const { modules } = require("../../../database/constants")
const ms = require('ms')
const bands = require("../../music/structures/Bands")
const _ = require("lodash");

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
        const parsedRange = parseInt(args[0]);
        if(parsedRange > 100 || parsedRange < 0) return message.channel.send(ErrorEmbed("dB must be between 0 and 100"))

        const msg = await message.channel.send(InfoEmbed("", "<a:loading:752246174550982728> Processing filter `BassBoost`."));

        const queue = player.getQueue(message.guild.id);

        if(parsedRange === 0) {
            queue.filterManager.toggle('bassboost', { force: 0 }); // force it off

            return msg.edit(InfoEmbed("", `<:yes:752247197436870666> Bassboost has been disabled`));
        }

        const success = queue.filterManager.toggle('bassboost', { force: 1, gain: parsedRange });

        if(success)
            msg.edit(InfoEmbed("", `<:yes:752247197436870666> Bassboost has been enabled`))
        else
            msg.edit(ErrorEmbed("", `<:no:750451799609311412> ${success.err ?? "General failure"}`))
    },

    config: {
        command: "bassboost",
        aliases: ["bass"],
        description: "Add bassboost effect.",
        permissions: [],
        usage: `bassboost <boost in dB>`,
        premium: true,
        requiresModules: [modules.MUSIC]
    }
}