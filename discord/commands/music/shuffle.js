const Discord = require("discord.js")
const { utils, logger, audioPlayers, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ms = require('ms')
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

        player.shuffle(message.guild.id)

        msg.edit(InfoEmbed("", `<:yes:752247197436870666> Songs Shuffled!`))

    },

    config: {
        command: "shuffle",
        aliases: ['radomizesongs'],
        description: "Shuffle songs in queue.",
        permissions: [],
        usage: `shuffle`,
        premium: false,
        requiresModules: [modules.MUSIC]
    }
}