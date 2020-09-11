const Discord = require("discord.js")
const { utils } = require("../../../globals");
const { guildOptionsOf } = require('../../../utils/dbUtils');
const { InfoEmbed, NoPermsEmbed, ErrorEmbed } = require("../../../utils/utils");

const { prefix: defaultPrefix } = require('../../../config.json')

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
    
        const guildOptions = guildOptionsOf(message.guild)
    
        const currentPrefix = await guildOptions.getPrefix();

        switch(args[0]? args[0].toLowerCase() : '') {
            case 'set':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())
                if(!args[1]) return message.channel.send(ErrorEmbed('Usage: `prefix set <new prefix>`'))
                if(args[1].length > 32) return message.channel.send(ErrorEmbed('The prefix must be under 32 characters!'))

                await guildOptions.setPrefix(args[1])

                message.channel.send(InfoEmbed('🤖 Prefix', `Prefix changed from \`${currentPrefix}\` to \`${args[1]}\``))

                break;

            case 'reset':
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(NoPermsEmbed())

                await guildOptions.setPrefix(defaultPrefix)

                message.channel.send(InfoEmbed('🤖 Prefix', `Prefix changed from \`${currentPrefix}\` to \`${defaultPrefix}\``))

                break;

            case '':

                message.channel.send(InfoEmbed("🤖 Prefix", `The current prefix is \`${currentPrefix}\``))

                break;

            default:
                message.channel.send(ErrorEmbed("Unknown Subcommand `" + args[0].toLowerCase() + "`"))
                break
        }

    },

    config: {
        command: "prefix",
        aliases: [],
        description: "Sets the bot's prefix",
        permissions: [],
        usage: `prefix [set/reset]`
    }
}