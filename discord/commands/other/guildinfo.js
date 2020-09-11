const Discord = require("discord.js")
const { InfoEmbed } = require("../../../utils/utils")
const botInfo = require("../../../botinfo.json")

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
        
        let teamInfo = []
        if(botInfo.guilds.main === guild.id) teamInfo.push("Octo's home")
        if(botInfo.guilds.testing.includes(guild.id)) teamInfo.push("Octo's testing residence")

        const embed = InfoEmbed("", "")
                        .setThumbnail(guild.iconURL())
                        .setAuthor(guild.name, guild.iconURL())
                        .addField("Owner", `<@${guild.owner.id}>`, true)
                        .addField("Created at", guild.createdAt.toString().replace(/\d+:\d+:\d+.*/, ''), true)
                        .addField("Region", guild.region, true)
                        .addField("Channel Categories", channelData.categories, true)
                        .addField("Text Channels", channelData.text, true)
                        .addField("Voice Channels", channelData.voice, true)
                        .addField("Members", guild.memberCount, true)
                        .addField("Humans", guild.members.cache.filter(m => !m.user.bot).size, true)
                        .addField("Bots", guild.members.cache.filter(m => m.user.bot).size, true)
                        .addField(`Roles [${roles.length}]`, roles.join(" "))
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