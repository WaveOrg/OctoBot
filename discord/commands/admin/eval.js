const Discord = require("discord.js")
const { userDataOf } = require("../../../utils/dbUtils")
const { ErrorEmbed, InfoEmbed, MessageEmbed } = require("../../../utils/utils")
const config = require('../../../botinfo.json')

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        let embed;

        if(args.length <= 0) return message.channel.send(ErrorEmbed("No code to crunch?"));
        
        let toEval = args.join(" ");

        if(toEval.includes("token")) return message.channel.send(ErrorEmbed("No token for you"));

        try {
            let evaled = await eval(toEval);
            message.channel.send(InfoEmbed("Code evaluation", "")
                .addField("Eval", "```js\n" + toEval + "\n```")
                .addField("Result", "```js\n" + evaled + "\n```"))
        } catch (err) {
            message.channel.send(ErrorEmbed("Error crunching the numbers.")
                .addField("Eval", "```js\n" + toEval + "\n```")
                .addField("Error", "```js\n" + err.toString() + "\n```"))
        }
    },

    config: {
        command: "eval",
        aliases: [],
        description: "eval thing",
        permissions: [],
        usage: `eval <code>`,
        admin: true
    }
}