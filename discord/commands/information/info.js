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
        let totalseconds = (client.uptime / 1000)
        let hours = Math.floor(totalseconds / 3600)
        totalseconds %= 3600
        let minutes = Math.floor(totalseconds / 60)
        let seconds = Math.floor(totalseconds % 60)

        uptime += `Uptime: ${hours}h , ${minutes}m , ${seconds}sec`

        const info = InfoEmbed("", "")

            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setFooter(uptime, client.user.displayAvatarURL())
            .setTimestamp()


            .addField(`**Version**`, `Beta`, true)
            .addField(`**Founders**`, `[MonkeyMax](https://github.com/ItzMonkeyMax), [Stefan](https://stefan.systems), [Derock](https://derock.dev/)`, true)
            .addField(`**Language**`, `[Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)`, true)

            .addField(`**Current Users**`, (await client.shard.fetchClientValues('users.cache.size')).reduce((a, b) => a + b, 0), true)
            .addField(`**Current Guilds**`, (await client.shard.fetchClientValues('guilds.cache.size')).reduce((a, b) => a + b, 0), true)
            .addField(`**Shards**`, client.shard.count, true)

            .addField(`**Support**`, `[Join Now](https://discord.gg/z9nznDY)`, true)
            .addField(`**Invite**`, `[Coming Soon]()`, true)
            .addField(`**Website**`, `[octodev.xyz](https://octodev.xyz)`, true)

        message.channel.send(info)
    },
    config: {
        command: "info",
        aliases: ["botinfo"],
        description: "Shows Bot's info",
        permissions: [],
        usage: `info`,
    }
}