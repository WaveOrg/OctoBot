const Discord = require("discord.js")
const { logger } = require("../../../globals");
const utils = require("../../../utils/utils")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if (command === "start") {
            let channel = message.member.voiceChannel;
            for (let member of channel.members) {
                member[1].setMute(true)
            }
         }
    
    },

    config: {
        command: "start",
        aliases: ["s"],
        description: "mutes all at the start of Among us",
        permissions: ["ADMINISTARTOR"],
        usage: `start`,
    }
}