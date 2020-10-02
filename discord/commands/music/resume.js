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

        if(client.voice.connections.get(message.guild.id)) {
            // if in vc already
            player.resume(message.guild.id);
        } else {
            // not in vc
            if(!message.member.voice.channel) return message.channel.send(ErrorEmbed("You are not in a VC"))
            
            const conn = await message.member.voice.channel.join();
            player
            player.resume(message.guild.id, conn)
        }

        message.channel.send(InfoEmbed("▶ Music Started", `I have resumed the music!`))

    },

    config: {
        command: "resume",
        aliases: ['rejoin'],
        description: "Resumes the current playing song.",
        permissions: [],
        usage: `resume`
    }
}