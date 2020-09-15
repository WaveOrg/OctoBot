const Discord = require("discord.js")
const { userDataOf } = require("../../../utils/dbUtils")
const { ErrorEmbed, InfoEmbed } = require("../../../utils/utils")
const config = require('../../../botinfo.json')

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        let user = message.mentions.users.first()
        if(!args[0]) return sendAdmin(message.channel, ErrorEmbed("Couldn't find that member"))
        if(!user) user = await client.users.fetch(args[0]).catch(() => { 
            user = null;
         })
        if(!user) return sendAdmin(message.channel, ErrorEmbed("Couldn't find that member"))

        const userData = userDataOf(user)

        await userData.togglePremium();
        
        sendAdmin(message.channel, InfoEmbed("Premium toggled", `<@${user.id}> is ${await userData.isPremium() ? "now" : "no longer"} a premium member`));
    },

    config: {
        command: "togglepremium",
        aliases: [],
        description: "Toggle user's premium status",
        permissions: [],
        usage: `togglepremium [mention|id]`,
        admin: true
    }
}

function sendAdmin(channel, message) {
    channel.send(message).then(msg => msg.delete({ timeout: 4000 }))
}