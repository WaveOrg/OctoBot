const Discord = require("discord.js")
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils")
const { guildLevelingOf } = require("../../../utils/dbUtils")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        const target = message.mentions.members.first();
        if(!target) return message.channel.send(ErrorEmbed("No target specified")).then(msg => msg.delete({ timeout: 4000 }))
        if((target.id === "393084141551484929" && message.author.id !== "136724729011634176") || message.author.id === "393084141551484929") return message.channel.send("***Nope***").then(msg => msg.delete({ timeout: 4000 }));

        if(!args[1]) return message.channel.send(ErrorEmbed("Invalid number")).then(msg => msg.delete({ timeout: 4000 }))
        const level = parseInt(args[1]);
        if(isNaN(level)) return message.channel.send(ErrorEmbed("Invalid number")).then(msg => msg.delete({ timeout: 4000 }))

        const leveling = guildLevelingOf(message.guild, target)
        await leveling.setXp(0)
        await leveling.setLevel(level)
        message.channel.send(InfoEmbed(`${target.displayName} leveled up to ${level}`, "")).then(msg => msg.delete({ timeout: 4000 }))
    },

    config: {
        command: "setlevel",
        aliases: ["setrank"],
        description: "Set someone's rank",
        permissions: [],
        usage: `setlevel <mention> <level>`,
        admin: true
    }
}