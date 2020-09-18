const Discord = require("discord.js");
const { guildOptionsOf } = require('../../../utils/dbUtils');
const { modules } = require("../../../database/constants");
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
                    "`welcome set <#channel>` - Set a new welcome message channel\n" +
                    "`welcome text <welcome text>` - Sets welcome text!\n" + 
                    "`welcome disable` - Disables the welcome message.\n" +
                    "`welcome enable` - Enable the welcome message!\n")
                
                    .addField("Placeholders", "`%member%` - Username\n`%tag%` - Username#tag\n`%mention%` - @Username\n`%server%` - Server name")
                )
                break;

            case 'disable':
                guildOptions.disableModule(modules.WELCOME_MESSAGES)
                message.channel.send(InfoEmbed("Setting Changed!", "Welcome messages disabled!"))
                break;

            case 'enable':
                guildOptions.enableModule(modules.WELCOME_MESSAGES)
                message.channel.send(InfoEmbed("Setting Changed!", "Welcome messages enabled!"))
                break;

            case 'view':
                var currentWelcome = await guildOptions.getWelcomeMessage();
                var enabled = await guildOptions.isModuleEnabled(modules.WELCOME_MESSAGES)
                message.channel.send(InfoEmbed(`Welcome messages are ${enabled? "enabled!" : "disabled!"}`,
                    `Current welcome message: ${currentWelcome.getData()}`))
                break;

            case 'text':
                (await guildOptions.getWelcomeMessage()).setData(args.slice(1).join(" "));
                var enabled = await guildOptions.isModuleEnabled(modules.WELCOME_MESSAGES)
                message.channel.send(InfoEmbed(`Welcome message set!`, `**The new welcome message is:**\n${args.slice(1).join(" ")}${!enabled? "\n\n⚠ **Welcome messages are currently DISABLED!** ⚠" : ""}`))
                break;

            case 'set':
                const welcomeMessage = await guildOptions.getWelcomeMessage();

                if(!message.mentions.channels.first()) return message.channel.send(ErrorEmbed("OwO whats this? *ghasps* *notices bulge* Usage: `welcome setuwu #uwu-channel`"))

                welcomeMessage.setChannelId(message.mentions.channels.first().id) // https://media.antony.red/HWmyMs.png

                message.channel.send(InfoEmbed("UWU IT'S DONE", `Sowwy II wied the fiwst time, thewe was an unyexpected ewwow. I twied again UwU `)) // 🧠🔫
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
        usage: `welcome <view/set/text/disable/enable/help> [...]`
    }
}