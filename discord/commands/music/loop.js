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

        const mode = player.getQueue(message.guild.id).repeatMode || false;
        player.setRepeatMode(message.guild.id, !mode)

        message.channel.send(InfoEmbed("🔁 Loop", `Songs in the queue will ${!mode ? "now loop" : "no longer loop"}!`))

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