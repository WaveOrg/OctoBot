const Discord = require("discord.js")
const { InfoEmbed } = require("../../../utils/utils")
const botInfo = require("../../../botinfo.json")

const uppercaseFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        
        let guild = message.guild;

        let channelData = {
            categories: 0,
            voice: 0,
            text: 0
        }

        guild.channels.cache.forEach(channel => {
            switch(channel.type) {
                case "category": channelData.categories++; break;
                case "text": channelData.text++; break;
                case "voice": channelData.voice++; break;
            }
        })

        const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role === guild.roles.everyone ? role.name : `<@&${role.id}>`)

        let characters = 0;
        const formattedRoles = roles.join(" ").length > 1020? roles.map(value => {
            if((characters + value.length + 1) > 1020) return ''
            else {
                characters + value.length + 1
                return value + ' ';
            }
        }) : roles.join(" ")
        
        let teamInfo = []
        if(botInfo.guilds.main === guild.id) teamInfo.push("Octo's home")
        if(botInfo.guilds.testing.includes(guild.id)) teamInfo.push("Octo's testing residence")

        const allMembers = await guild.members.fetch()

        const embed = InfoEmbed("", "")
                        .setThumbnail(guild.iconURL())
                        .setAuthor(guild.name, guild.iconURL())
                        .addField("Owner", `<@${guild.owner.id}>`, true)
                        .addField("Created at", guild.createdAt.toString().replace(/\d+:\d+:\d+.*/, ''), true)
                        .addField("Region", uppercaseFirstLetter(guild.region), true)
                        .addField("Channel Categories", channelData.categories, true)
                        .addField("Text Channels", channelData.text, true)
                        .addField("Voice Channels", channelData.voice, true)
                        .addField("Members", guild.memberCount, true)
                        .addField("Humans", allMembers.filter(m => !m.user.bot).size, true)
                        .addField("Bots", allMembers.filter(m => m.user.bot).size, true)
                        .addField(`Roles [${roles.length}]`, formattedRoles)
                        .setFooter("ID: " + guild.id)
                        .setTimestamp()

        if(teamInfo.length > 0) embed.addField("Octo Team", teamInfo.join(", "))

        message.channel.send(embed)

    },

    config: {
        command: "serverinfo",
        aliases: ["guildinfo", "whereami"],
        description: "View info about a server",
        permissions: [],
        usage: `serverinfo`,
    }
}