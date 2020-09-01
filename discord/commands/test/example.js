const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        // To send a NORMAL EMBED
        message.channel.send(utils.InfoEmbed("TITLE", "DESC"))
        
        // To send an ERROR EMBED
        message.channel.send(utils.ErrorEmbed("ERROR REASON"))

        // The util funtions return a normal Discord.MessagEmbed, so you can do things like .addField or .setFooter
        message.channel.send(utils.InfoEmbed("Info Embed with a Field", "Use .addField after to add a field!").addField("Field Title", "Field Description"))

        // Since this is a PUBLIC BOT, remember to surround things with a try {} catch (e) {} WHENEVER POSSIBLE
        // This will prevent bot crashes from errors; ergo better UX

        // The folder the command is in will be it's category. Ex: If ban.js was in a folder named 'moderation', then the category will be 'Moderation'.
        // Every command gets automatically added into the help command if it is created properly.
        // For debugging, use `logger.debug("debug message here")`
        // For info messages into console, use `logger.info("info message here")`
        // STAY ORGANIZED.
        // -------- DO NOT ADD DATABASES YET -- I WILL CREATE A SYSTEM FOR THAT --------
        // I WILL ALSO BE DOING A MUSIC SYSTEM

        // Please keep all your code clean and readable, and make sure to commit your changes! 
        // Test commands too!
    },

    config: {
        command: "examplecmd",
        aliases: ["test"],
        description: "This is a test command",
        permissions: ["ADMINISTRATOR"],
        usage: `{{PREFIX}}examplecmd`
    }
}