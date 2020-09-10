const { prefix } = require("../../config.json");
const { utils, statcord, logger } = require("../../globals");

const guildOptions = require('../../database/models/GuildOptions');
const { InfoEmbed, RedEmbed, ErrorEmbed } = require("../../utils/utils");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").Message} message 
     */
    async run(client, message) {
        if(message.author.bot) return;
        if(message.channel.type != "text") return;

        let {prefix: _prefix, activeModules} = (await guildOptions.findOne({ guildId: message.guild.id }).exec())

        if(message.content.trim() == `<@!${client.user.id}>`) return message.channel.send(InfoEmbed('🤖 Bot Prefix', `The current prefix is \`${_prefix}\``))
        if(message.content.startsWith(`<@!${client.user.id}>`)) _prefix = `<@!${client.user.id}>`

        if(!message.content.toLowerCase().startsWith(_prefix)) return;

        const arguments = message.content.slice(_prefix.length).trim().split(/ +/g);
        const command = arguments.shift().toLowerCase();

        let cmd = client.commands.get(command);
        if(!cmd) return

        if(!activeModules.includes(cmd.category) && cmd.category != "configuration") return message.channel.send(ErrorEmbed("This module is disabled!"))

        statcord.postCommand(command, message.author.id)

        if(cmd.config.permissions && cmd.config.permissions.filter(perm => message.member.hasPermission(perm)).length != cmd.config.permissions.length) {
            return message.channel.send(utils.NoPermsEmbed())
        }
        
        try {
            cmd.run(message, arguments, client)
        } catch (error) {
            logger.error(`Got an error when processing ${message.content}\n${error}\nUSER: ${message.author.id}`)
        }
    },
    config: {
        name: "Message",
        type: "message"
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}