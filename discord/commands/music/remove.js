const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const { modules } = require("../../../database/constants")
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
        if(!args[0] || isNaN(args[0])) return message.channel.send(ErrorEmbed("Usage: " + this.config.usage))

        try {
            const song = player.getQueue(message.guild.id).tracks[parseInt(args[0]) - 1];
            player.getQueue(message.guild.id).tracks.splice(parseInt(args[0]) - 1, 1);

            message.channel.send(InfoEmbed("✂ Removed from Queue", `${song.title} has been removed from the queue.`))
        } catch (error) {
            return message.channel.send(ErrorEmbed("<:no:750451799609311412> Couldn't find that song!").setTitle(""))
        }
        
    },

    config: {
        command: "remove",
        aliases: [],
        description: "Removes a song from queue.",
        permissions: [],
        usage: `remove <0-200>`,
        premium: true,
        requiresModules: [modules.MUSIC]
    }
}