const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require('../../../utils/utils');

const responses = ["rock", "paper", "scissors"]

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[0] || !["rock", "paper", "scissors", "r", "p", "s"].includes(args[0].toLowerCase())) 
            return message.channel.send(ErrorEmbed("Usage: `" + this.config.usage + "`"));

        const response = responses[Math.floor(Math.random() * responses.length)]

        var userInput = args[0].toLowerCase();

        if(userInput == "r") userInput = "rock"
        if(userInput == "p") userInput = "paper"
        if(userInput == "s") userInput = "scissors"

        if(userInput == response) {
            message.channel.send(InfoEmbed("It's a TIE!", `User Selected \`${userInput}\`\nComputer Selected \`${response}\``))
        } else if(
            (userInput == "paper" && response == "rock") || 
            (userInput == "rock" && response == "paper") || 
            (userInput == "scissors" && response == "rock")
        ) {
            message.channel.send(InfoEmbed("🎉 User Wins!", `User Selected \`${userInput}\`\nComputer Selected \`${response}\``))
        } else if(
            (userInput == "rock" && response == "paper") || 
            (userInput == "paper" && response == "rock") || 
            (userInput == "rock" && response == "scissors")
        ) {
            message.channel.send(InfoEmbed("🎉 Computer Wins!", `User Selected \`${userInput}\`\nComputer Selected \`${response}\``))
        } else {
            message.channel.send(InfoEmbed("Rock Paper Scissors", `User Selected \`${userInput}\`\nComputer Selected \`${response}\``))
        }

    },

    config: {
        command: "rps",
        aliases: ["rockpaperscissors"],
        description: "Rock Paper Scissors",
        permissions: [],
        usage: `rps <rock/paper/scissors/r/p/s>`
    }
}