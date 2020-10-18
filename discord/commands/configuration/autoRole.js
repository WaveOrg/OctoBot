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
                message.channel.send(InfoEmbed("Auto Role help.", 
                    "`autorole disable` - Disabled the auto role!\n" +
                    "`autorole view` - View the auto role!\n" +
                    "`autorole @role` - Set a new auto role role\n")
                )
                break;

            case "view":
                if(await guildOptions.isAutoRoleEnabled()) {
                    message.channel.send(`Auto role is enabled`, `Auto Role is set to <@&${await guildOptions.getAutoRoleId()}`)
                }

                message.channel.send(`Auto role is disabled`, "")
                break;

            case 'disable':
                await guildOptions.disableAutoRole();
                message.channel.send(InfoEmbed("Setting Changed!", "Auto Role disabled!"))
                break;

            default:
                let role;

                let name = args.join(" ").toLowerCase()

                if(!role) role = message.mentions.roles.first()
                if(!role) role = message.guild.roles.cache.find(r => r.id === args[0])
                if(!role) role = message.guild.roles.cache.find(r => r.name === args[0]);
                if(!role) return message.channel.send(ErrorEmbed(`I can't find a role that goes by \`${name}\``))

                guildOptions.enableAutoRole(role.id);
                message.channel.send(InfoEmbed("Setting Changed!", `Auto Role set to <@&${role.id}>`))
                break;
        }

    },

    config: {
        command: "autorole",
        aliases: [],
        description: "Sets an Auto Role",
        permissions: ["ADMINISTRATOR"],
        usage: `autoRole <help/view/disabled/role id>`
    }
}