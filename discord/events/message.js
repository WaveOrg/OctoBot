const { logger } = require("../../globals");
const Statcord = require('statcord.js')

const { InfoEmbed, ErrorEmbed, NoPermsEmbed } = require("../../utils/utils");
const { userDataOf, guildOptionsOf } = require("../../utils/dbUtils")
const { modules } = require("../../database/constants")
const { headDevs, projectLeads } = require("../../botinfo.json")
const ms = require("ms")

// I know I don't have to put these in every file I use them in, but it's more readable if I do imo
Array.prototype.betterPush = function(value) {
    this.push(value);
    return this;
};

Array.prototype.remove = function(value) {
    const index = this.indexOf(value)
    if(index > -1) {
        this.splice(index, 1);
    }
    return this;
}

// Key: userId
// Value: [{ command: "", time: 00000 }] Time is when the user should be able to do the command again
const cooldowns = new Map()

// An interval that checks for expired cooldowns every minute so memory doesn't go out
setInterval(() => {
    for(let [autorId, cooldownObjectArray] of cooldowns.entries()) {
        for(let cooldownObject of cooldownObjectArray) {
            if(cooldownObject.time <= Date.now()) {
                cooldowns.get(autorId).remove(cooldownObject);
            }
        }
    }
    
}, 60000);

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").Message} message 
     */
    async run(client, message) {
        if(message.author.bot) return;
        if(message.channel.type != "text") return;

        const guildOptions = guildOptionsOf(message.guild)
        let {prefix: _prefix, activeModules} = await guildOptions.getFromDatabase()

        if(message.content.trim() == `<@!${client.user.id}>`) return message.channel.send(InfoEmbed('🤖 Bot Prefix', `The current prefix is \`${_prefix}\``))
        if(message.content.startsWith(`<@!${client.user.id}>`)) _prefix = `<@!${client.user.id}>`

        if(!message.content.toLowerCase().startsWith(_prefix)) return;

        const arguments = message.content.slice(_prefix.length).trim().split(/ +/g);
        const command = arguments.shift().toLowerCase();

        const cmd = client.commands.get(command);
        if(!cmd) return

        const cmdConfig = cmd.config;

        // If command is admin, we just execute it and don't post to statcord because, well
        // Only head devs and project leads can execute
        // Also, automatically deletes the message
        if(cmdConfig.admin) {
            message.delete()
            if(headDevs.includes(message.author.id) || projectLeads.includes(message.author.id)) {
                try {
                    cmd.run(message, arguments, client)
                } catch (error) {
                    logger.error(`Got an error when processing ${message.content}\n${error}\nUSER: ${message.author.id}`)
                }
            }
            
            return
        }

        Statcord.ShardingClient.postCommand(command, message.author.id, client)

        if(cmdConfig.permissions && cmdConfig.permissions.filter(perm => message.member.hasPermission(perm)).length != cmdConfig.permissions.length) {
            return message.channel.send(NoPermsEmbed())
        }

        if(cooldowns.has(message.author.id)) {
            const entry = cooldowns.get(message.author.id).find(cooldownObject => cooldownObject.command === cmdConfig.command);
            if(entry) {
                if(entry.time <= Date.now()) {
                    cooldowns.get(message.author.id).remove(entry);
                } else {
                    return message.channel.send(ErrorEmbed(`You're on a cooldown for this command for ${ms(entry.time - Date.now(), {long: true})}`))
                }
            }
        }

        if(cmdConfig.requiresModules && cmdConfig.requiresModules.filter(module => activeModules.includes(module)).length !== cmdConfig.requiresModules.length) {
            return message.channel.send(ErrorEmbed(`Modules \`${cmdConfig.requiresModules.map(module => getKeyByValue(modules, module)).map(module => module.split("_").map(module => module.charAt(0).toUpperCase() + module.substring(1).toLowerCase()).join(" ")).join(",")}\` need to be enabled for this command to work`))
        }

        const userData = userDataOf(message.author)

        if(cmdConfig.cooldown && cmdConfig.cooldown.time) {
            if(!cmdConfig.cooldown.premiumBypassable || !(await userData.isPremium())) {
                const cooldownObject = { command: cmdConfig.command, time: Date.now() + cmdConfig.cooldown.time };
                cooldowns.set(message.author.id,
                    cooldowns.has(message.author.id) ? cooldowns.get(message.author.id).betterPush(cooldownObject) : [cooldownObject])
            }
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