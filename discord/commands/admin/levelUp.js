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

        const leveling = guildLevelingOf(message.guild, target)
        await leveling.levelUp()
        message.channel.send(InfoEmbed(`${target.displayName} leveled up to ${await leveling.getLevel()}`, "")).then(msg => msg.delete({ timeout: 4000 }))
    },

    config: {
        command: "levelup",
        aliases: ["rankup"],
        description: "Level someone up",
        permissions: [],
        usage: `levelup <mention>`,
        admin: true
    }
}