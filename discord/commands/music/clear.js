const Discord = require("discord.js")
const { player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        
        if(!player.isPlaying(message.guild.id)) return message.channel.send(ErrorEmbed("Nothing is playing!"))

        await player.clearQueue(message.guild.id);

        message.channel.send(InfoEmbed("🗑 Queue Cleared", `The queue has been cleared!`))
    },

    config: {
        command: "clear",
        aliases: ["removeeveryfuckingsong", "clearqueue"],
        description: "Clears the entire queue.",
        permissions: [],
        usage: `clear`
    }
}