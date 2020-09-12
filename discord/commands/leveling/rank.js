const Discord = require("discord.js")
const { guildLevelingOf } = require("../../../utils/dbUtils");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        let member;
        if(!args[0]) member = message.member;

        let name = args.join(" ").toLowerCase()

        if(!member) member = message.mentions.members.first()
        if(!member) member = message.guild.members.cache.find(m => m.id === args[0])
        if(!member) member = message.guild.members.cache.find(m => m.user.tag.toLowerCase() === name);
        if(!member) member = message.guild.members.cache.find(m => m.displayName.toLowerCase() === name);
        if(!member) member = message.guild.members.cache.find(m => m.displayName.toLowerCase().startsWith(name))
        if(!member) return message.channel.send(ErrorEmbed(`I can't find a guild member that goes by \`${name}\``))

        /*const userData = userDataOf(member.user)

        const rankCard = await userData.getRankCard()
        if(rankCard === "null") return message.channel.send(ErrorEmbed(`<@${member.id}> does not have a valid rank card.`))

        message.channel.send(new Discord.MessageAttachment(Buffer.from(rankCard, "base64")))*/
        const leveling = guildLevelingOf(message.guild, member.user)
        message.channel.send(InfoEmbed(`Level: ${await leveling.getLevel()}`, `Xp: ${await leveling.getXp()}`))
    },

    config: {
        command: "rank",
        aliases: ["level"],
        description: "View your rank",
        permissions: [],
        usage: `rank [mention/name/id]`,
    }
}