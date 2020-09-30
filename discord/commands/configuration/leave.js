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
                message.channel.send(InfoEmbed("Leave Message help.", 
                    "`leave view` - View the current leave message!\n" +
                    "`leave set <#channel>` - Set a new leave message channel\n" +
                    "`leave text <leave text>` - Sets leave text!\n" + 
                    "`leave disable` - Disables the leave message.\n" +
                    "`leave enable` - Enable the leave message!\n")
                
                    .addField("Placeholders", "`%member%` - Username\n`%tag%` - Username#tag\n`%mention%` - @Username\n`%server%` - Server name")
                )
                break;

            case 'disable':
                guildOptions.disableModule(modules.LEAVE_MESSAGES)
                message.channel.send(InfoEmbed("Setting Changed!", "Leave messages disabled!"))
                break;

            case 'enable':
                guildOptions.enableModule(modules.LEAVE_MESSAGES)
                message.channel.send(InfoEmbed("Setting Changed!", "Leave messages enabled!"))
                break;

            case 'view':
                var currentWelcome = await guildOptions.getLeaveMessage();
                var enabled = await guildOptions.isModuleEnabled(modules.LEAVE_MESSAGES)
                message.channel.send(InfoEmbed(`Leave messages are ${enabled ? "enabled!" : "disabled!"}`,
                    `Current leave message: ${currentWelcome.getData()}`))
                break;

            case 'text':
                (await guildOptions.getLeaveMessage()).setData(args.slice(1).join(" "));
                var enabled = await guildOptions.isModuleEnabled(modules.LEAVE_MESSAGES)
                message.channel.send(InfoEmbed(`Leave message set!`, `**The new leave message is:**\n${args.slice(1).join(" ")}${!enabled? "\n\n⚠ **Leave messages are currently DISABLED!** ⚠" : ""}`))
                break;

            case 'set':
                const leaveMessage = await guildOptions.getLeaveMessage();

                if(!message.mentions.channels.first()) return message.channel.send(ErrorEmbed("Usage: `leave set #channel`"))

                leaveMessage.setChannelId(message.mentions.channels.first().id) // https://media.antony.red/HWmyMs.png

                message.channel.send(InfoEmbed("Changed", `Leave message channel changed!`))
                break;

            default:
                message.channel.send(ErrorEmbed("Unknown Subcommand!"))
                break;
        }

    },

    config: {
        command: "leave",
        aliases: [],
        description: "Sets a leave message!",
        permissions: ["ADMINISTRATOR"],
        usage: `leave <view/set/text/disable/enable/help> [...]`
    }
}