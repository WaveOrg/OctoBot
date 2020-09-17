const Discord = require("discord.js")
const { InfoEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        let uptime = '';
        let totalseconds = (this.bot.uptime / 1000)
        let hours = Math.floor(totalseconds / 3600)
        totalseconds %= 3600
        let minutes = Math.floor(totalseconds / 60)
        let seconds = Math.floor(totalseconds % 60)

        uptime += `Uptime: ${hours}h , ${minutes}m , ${seconds}sec`
    
        const info = InfoEmbed("", "")

        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setFooter(uptime, client.user.displayAvatarURL())
        .setColor('DARK_BLUE')
        .setTimestamp()
    

        .addField(`**Version**`, `Beta`, true)
        .addField(`**Founder**`, `[MonkeyMax](https://github.com/ItzMonkeyMax)`, true)
        .addField(`**Library**`, `[Discord.JS](https://discord.js.org/#/)`, true)
        
        .addField(`**Current Users**`, client.guilds.cache.reduce((a, b) => a + b.memberCount, 0), true)
        .addField(`**Support**`, `[Join Now](https://discord.gg/z9nznDY)`, true)
        .addField(`**Invite**`, `[Coming Soon]()`, true)

        .addField(`**Current Guilds**`, client.guilds.cache.size, true)
        .addField(`**Website**`, `[octodev.xyz](https://octodev.xyz)`)

        message.channel.send(info) 
    }
}