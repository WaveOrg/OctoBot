const Discord = require("discord.js")
const { utils } = require("../../../globals");
const guildOptions = require('../../../database/models/GuildOptions');
const { InfoEmbed, NoPermsEmbed, ErrorEmbed } = require("../../../utils/utils");

// Normally Array.prototype.push() returns the length, so this betterPush returns the new array, allowing for a little cleaner code imo.
Array.prototype.betterPush = function(x) {
    this.push(x);
    return this;
};

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        switch(args[0]? args[0].toLowerCase() : null) {
            case 'enable':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `module enable <prefix> <module name>`\nRun `module list` to see all possibilities!'))
                if(!Object.keys(guildOptions.modules).some(m => args[1].toUpperCase().trim() == m)) return message.channel.send(ErrorEmbed('Unknown Module!\nRun `module list` to see all possibilities!'))

                var moduleToEnable = args[1].toUpperCase().trim()

                var currentModules = (await guildOptions.findOne({ guildId: message.guild.id }).exec()).activeModules
                await guildOptions.updateOne({ guildId: message.guild.id }, { activeModules: currentModules.includes(moduleToEnable)? currentModules : currentModules.betterPush(moduleToEnable) })

                message.channel.send(InfoEmbed('🛡 Module Enabled', `\`${args[1].toUpperCase()}\` has been enabled!`))

                break;

            case 'disable':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `module enable <prefix> <module name>`\nRun `module list` to see all possibilities!'))
                if(!Object.keys(guildOptions.modules).some(m => args[1].toUpperCase().trim() == m)) return message.channel.send(ErrorEmbed('Unknown Module!\nRun `module list` to see all possibilities!'))

                var moduleToEnable = args[1].toUpperCase().trim()

                var currentModules = (await guildOptions.findOne({ guildId: message.guild.id }).exec()).activeModules
                await guildOptions.updateOne({ guildId: message.guild.id }, { activeModules: currentModules.includes(moduleToEnable)? removeItemOnce(currentModules, moduleToEnable) : currentModules })

                message.channel.send(InfoEmbed('🛡 Module Enabled', `\`${args[1].toUpperCase()}\` has been disabled!`))

                break;

            case 'status':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `module enable <prefix> <module name>`\nRun `module list` to see all possibilities!'))
                if(!Object.keys(guildOptions.modules).some(m => args[1].toUpperCase().trim() == m)) return message.channel.send(ErrorEmbed('Unknown Module!\nRun `module list` to see all possibilities!'))

                var moduleToEnable = args[1].toUpperCase().trim()

                var currentModules = (await guildOptions.findOne({ guildId: message.guild.id }).exec()).activeModules

                message.channel.send(InfoEmbed('🛡 Module Status', `\`${args[1].toUpperCase()}\` is currently ${currentModules.includes(moduleToEnable)? "enabled" : "disabled"}!`))

                break;

            case 'list':

                message.channel.send(InfoEmbed("🛡 All Modules", Object.keys(guildOptions.modules).map(f => `\`${f}\`\n`).join("")))

                break;

            default:
                message.channel.send(ErrorEmbed("Unknown Subcommand " + (args[0]? args[0].toLowerCase() : "") + "\nUse `help module` for more info!"))
                break
        }

    },

    config: {
        command: "module",
        aliases: [],
        description: "Sets the bot's prefix",
        permissions: [],
        usage: `module <enable/disable/status/list> [module name]`
    }
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}