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
        
        if(!player.isPlaying(message.guild.id)) return message.channel.send(ErrorEmbed("Nothing is playing!"));
        if(!player.getQueue(message.guild.id).player.paused) return message.channel.send(ErrorEmbed("Music not paused!"));

        player.setPause(false, message.guild.id);

        message.channel.send(InfoEmbed("▶ Music Started", `I have resumed the music!`))

    },

    config: {
        command: "resume",
        aliases: [],
        description: "Resumes the current playing song.",
        permissions: [],
        usage: `resume`,
        requiresModules: [modules.MUSIC]
    }
}