const Discord = require("discord.js");
const { guildOptionsOf } = require('../../../utils/dbUtils');
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        
        const guildOptions = guildOptionsOf(message.guild);
        
        switch(args[0]? args[0].toLowerCase() : "help") {

            case 'help':
                message.channel.send(InfoEmbed("Welcome module help.", 
                    "`welcome view` - View the current welcome message!\n" +
                    "`welcome set <new welcome message>` - Set a new welcome message\n" + 
                    "`welcome disable` - Disables the welcome message.\n" +
                    "`welcome enable` - Enable the welcome message!\n")
                
                    .addField("Placeholders", "`%member%` - Username\n`%tag%` - Username#tag\n`%mention%` - @Username\n`%server%` - Server name")
                )
                break;

            case 'disable':
                guildOptions.disableModule('WELCOME_MESSAGES')
                message.channel.send(InfoEmbed("Setting Changed!", "Welcome messages disabled!"))
                break;

            case 'enable':
                guildOptions.enableModule('WELCOME_MESSAGES')
                message.channel.send(InfoEmbed("Setting Changed!", "Welcome messages enabled!"))
                break;

            case 'view':
                var currentWelcome = await guildOptions.getWelcomeMessage();
                var enabled = await guildOptions.isModuleEnabled("WELCOME_MESSAGES")
                message.channel.send(InfoEmbed(`Welcome messages are ${enabled? "enabled!" : "disabled!"}`,
                    `Current welcome message: ${currentWelcome.databaseResponse.data}`))
                break;

            case 'set':
                await guildOptions.setProperty("messages.welcome.data", args.slice(1).join(" "))
                var enabled = await guildOptions.isModuleEnabled("WELCOME_MESSAGES")
                message.channel.send(InfoEmbed(`Welcome message set!`, `**The new welcome message is:**\n${args.slice(1).join(" ")}${!enabled? "\n\n⚠ **Welcome messages are currently DISABLED!** ⚠" : ""}`))
                break;

            default:
                message.channel.send(ErrorEmbed("Unknown Subcommand!"))
                break;
        }

    },

    config: {
        command: "welcome",
        aliases: [],
        description: "Sets a welcome message!",
        permissions: ["ADMINISTRATOR"],
        usage: `welcome <view/set/disable/enable/help> [...]`
    }
}