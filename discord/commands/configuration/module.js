const Discord = require("discord.js")
const { guildOptionsOf } = require('../../../utils/dbUtils');
const { InfoEmbed, NoPermsEmbed, ErrorEmbed } = require("../../../utils/utils");
const { modules } = require("../../../database/constants")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        const guildOptions = guildOptionsOf(message.guild);
        switch(args[0] ? args[0].toLowerCase() : null) {
            case 'enable':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `module enable <prefix> <module name>`\nRun `module list` to see all possibilities!'))
                if(!Object.keys(modules).some(m => args[1].toUpperCase().trim() === m)) return message.channel.send(ErrorEmbed('Unknown Module!\nRun `module list` to see all possibilities!'))

                await guildOptions.enableModule(modules[args[1].toUpperCase().trim()])

                message.channel.send(InfoEmbed('🛡 Module Enabled', `\`${args[1].toUpperCase()}\` has been enabled!`))

                break;

            case 'disable':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `module enable <prefix> <module name>`\nRun `module list` to see all possibilities!'))
                if(!Object.keys(modules).some(m => args[1].toUpperCase().trim() == m)) return message.channel.send(ErrorEmbed('Unknown Module!\nRun `module list` to see all possibilities!'))

                await guildOptions.disableModule(modules[args[1].toUpperCase().trim()])

                message.channel.send(InfoEmbed('🛡 Module Enabled', `\`${args[1].toUpperCase()}\` has been disabled!`))

                break;

            case 'status':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `module enable <prefix> <module name>`\nRun `module list` to see all possibilities!'))
                if(!Object.keys(modules).some(m => args[1].toUpperCase().trim() == m)) return message.channel.send(ErrorEmbed('Unknown Module!\nRun `module list` to see all possibilities!'))

                const currentModules = await guildOptions.getActiveModules()

                message.channel.send(InfoEmbed('🛡 Module Status', `\`${args[1].toUpperCase()}\` is currently ${currentModules.includes(modules[args[1].toUpperCase().trim()]) ? "Enabled" : "Disabled"}!`))

                break;

            case 'list':

                const activeModules = await guildOptions.getActiveModules()
                message.channel.send(InfoEmbed("🛡 All Modules", Object.keys(modules).map(f => `\`${f}\` -> ${activeModules.includes(modules[f]) ? "Enabled" : "Disabled"}\n`).join("")))

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