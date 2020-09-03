const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = utils;

const responses = ["Yes", "No", "Maybe", "Perhaps", "Hmm"]

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[0]) {
            message.channel.send(ErrorEmbed("You need to specify something"));
            return;
        }

        const thing = args.join(" ");
        message.channel.send(InfoEmbed(thing, responses[Math.floor(Math.random() * responses.length)]));
    },

    config: {
        command: "8ball",
        aliases: [],
        description: "Picks a random answer to something",
        permissions: [],
        usage: `8ball <something>`
    }
}