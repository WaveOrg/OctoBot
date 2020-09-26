const Discord = require("discord.js")
const { userDataOf } = require("../../../utils/dbUtils")
const { utils, logger } = require("../../../globals");
const { ErrorEmbed, InfoEmbed } = require("../../../utils/utils")
const botInfo = require("../../../botinfo.json")

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

        const userData = userDataOf(member.user)

        const isPremium = await userData.isPremium()

        const roles = member.roles.cache.filter(role => role !==  member.guild.roles.everyone).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`)
        let characters = 0;
        const formattedRoles = roles.join(" ").length > 1020? roles.map(value => {
            if((characters + value.length + 1) > 1020) return ''
            else {
                characters + value.length + 1
                return value + ' ';
            }
        }) : roles.join(" ")

        const allMembers = await member.guild.members.fetch();

        const joinPosition = allMembers.sort((a, b) => b.joinedTimestamp - a.joinedTimestamp).keyArray().reverse().indexOf(member.id) + 1

        const acknowledgements = []
        if(member.guild.owner === member) acknowledgements.push("Server Owner")
        else if(member.permissions.has("ADMINISTRATOR")) acknowledgements.push("Server Administrator")
        if(member.user.bot) acknowledgements.push("Bot")
        
        let teamInfo = []
        if(botInfo.bots.stable === member.id) teamInfo.push("Mentally stable Octo")
        if(botInfo.bots.dev === member.id) teamInfo.push("Young Octo")
        if(botInfo.bots.live === member.id) teamInfo.push("Live Octo")
        if(botInfo.projectLeads.includes(member.id)) teamInfo.push("Project Lead")
        if(botInfo.headDevs.includes(member.id)) teamInfo.push("Head Developer")
        if(botInfo.devs.includes(member.id)) teamInfo.push("Developer")

        const embed = InfoEmbed("", `<@${member.id}> ${isPremium ? " - Premium user" : ""}`)
                        .setThumbnail(member.user.avatarURL())
                        .setAuthor(member.user.tag, member.user.avatarURL())
                        .addField("Joined server", member.joinedAt.toString().replace(/\d+:\d+:\d+.*/, ''), true)
                        .addField("Account created", member.user.createdAt.toString().replace(/\d+:\d+:\d+.*/, ''), true)
                        .addField("Join position", joinPosition, true)
                        .setFooter("ID: " + member.id)
                        .setTimestamp()

        if(roles.length > 0) embed.addField(`Roles [${roles.length}]`, formattedRoles, true)
        if(acknowledgements.length > 0) embed.addField("Acknowledgements", acknowledgements.join(", "), true)
        if(teamInfo.length > 0) embed.addField("Octo Team", teamInfo.join(", "))

        message.channel.send(embed)

    },

    config: {
        command: "userinfo",
        aliases: ["whoami", "whois"],
        description: "View info about a user",
        permissions: [],
        usage: `userinfo [mention/name/id]`,
    }
}