const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require('../../../utils/utils');

const responses = ["Yes", "No", "Maybe", "Perhaps", "Ask me again later", "Probably", "I don't think so"]

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[0]) {
            message.channel.send(ErrorEmbed("You need ot specify something."));
            return;
        }

        var title = args.join(" ");
        if(title.length > 256) title = title.substr(0, 253) + '...'

        if(message.content.includes("max") && (message.content.includes("die") || message.content.includes("not good"))) return message.channel.send(InfoEmbed(title, "Definitely"));
        message.channel.send(InfoEmbed(title, responses[Math.floor(Math.random() * responses.length)]));
    },

    config: {
        command: "8ball",
        aliases: [],
        description: "Picks a random answer to something",
        permissions: [],
        usage: `8ball <something>`
    }
}