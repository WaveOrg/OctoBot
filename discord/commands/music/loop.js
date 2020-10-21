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

        if(!args[0] || !['off', 'current', 'queue'].includes(args[0].toLowerCase())) return message.channel.send(ErrorEmbed("Usage: `loop <off/current/queue>`"));

        const mode = args[0].toLowerCase() == "off" ? false : args[0].toLowerCase();
        player.getQueue(message.guild.id).setLoop(mode);

        message.channel.send(InfoEmbed("🔁 Loop", 
            mode == "current" ? "The current song will continue to play" 
            : mode == "queue" ? "The songs in the queue will now loop" 
            : "Looping disabled"
        ))

    },

    config: {
        command: "loop",
        aliases: ["repeat"],
        description: "Loops the current queue.",
        permissions: [],
        usage: `loop`,
        requiresModules: [modules.MUSIC]
    }
}