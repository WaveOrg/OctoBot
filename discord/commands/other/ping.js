const Discord = require("discord.js")
const { utils } = require("../../../globals");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        let msg = await message.channel.send("Pinging...")
        msg.edit("", utils.InfoEmbed("🚦 Bot Ping", `Round Trip Latency is ${msg.createdTimestamp - message.createdTimestamp}ms, websocket latency is ${client.ws.ping}ms.`))
    },
    config: {
        command: "ping",
        aliases: ["lag"],
        description: "Check the bot's ping!",
        usage: `ping`
    }
}