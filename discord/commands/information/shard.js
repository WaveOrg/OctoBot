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
        message.channel.send(InfoEmbed(`Shard ID: ${message.guild.shardID}`, `There are ${client.shard.count} total shards!\nThis shard is responsible for ${client.guilds.cache.size} guilds, with ${client.users.cache.size} users.`))
    },
    config: {
        command: "shard",
        aliases: [],
        description: "Check what shard is responsible for this server!",
        usage: `shard`
    }
}