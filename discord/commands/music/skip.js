const Discord = require("discord.js")
const { player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
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

        player.skip(message.guild.id)

        message.channel.send(InfoEmbed("⏭ Skipped", `The song has been skipped!`))

    },

    config: {
        command: "skip",
        aliases: [],
        description: "Skips the current song.",
        permissions: [],
        usage: `skip`,
        requiresModules: [modules.MUSIC]
    }
}