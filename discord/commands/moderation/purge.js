const Discord = require("discord.js")
const { InfoEmbed, ErrorEmbed, RedEmbed } = require('../../../utils/utils');
const { userDataOf } = require("../../../utils/dbUtils")
const { logger } = require("../../../globals");
const { modules } = require("../../../database/constants");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        if(!message.channel.permissionsFor(message.client.user).has("MANAGE_MESSAGES")) return message.channel.send(ErrorEmbed("I need the `Manage Messages` permission to do this!"))

        if(!args[0] || isNaN(args[0]) || parseInt(args[0]) < 1) return message.channel.send(ErrorEmbed("Usage: `" + this.config.usage +"`"));
            
        const premiumStatus = await userDataOf(message.author).isPremium();

        if(!premiumStatus && parseInt(args[0]) > 200) return message.channel.send(ErrorEmbed("Only premium users can delete over 200 messages!"));
        if(parseInt(args[0]) > 1000) return message.channel.send(ErrorEmbed("You can only delete up to 1000 messages!"));

        const sent = await message.channel.send(RedEmbed("<a:loading:752246174550982728> Deleting Messages", `Current Status: 0/${args[0]}`))
        const amount = parseInt(args[0]);

        var totalDeleted = 0;
        var remainingAmount = amount;

        new Promise((r, e) => {
            const interval = setInterval(async () => {
                let toDelete;
                if(remainingAmount > 99) {
                    toDelete = 99;
                    remainingAmount -= 99;
                } else {
                    toDelete = remainingAmount;
                    remainingAmount = 0;
                    clearInterval(interval);
                }
    
                const messagesToDelete = await (await message.channel.messages.fetch({ limit: toDelete + 1 }).catch(e)).filter(msg => msg.id != sent.id)
                const deleted = await message.channel.bulkDelete(messagesToDelete).catch(err => {
                    if(!err.includes('under 14 days old')) e(err)
                });
                totalDeleted += deleted.size || 0;
                sent.edit(RedEmbed("<a:loading:752246174550982728> Deleting Messages", `Current Status: ${totalDeleted}/${args[0]}`))

                if(remainingAmount <= 0) r()
            }, 1500)
        }).then(() => {
            sent.edit(InfoEmbed("🗑 Messages Purged", `Successfully deleted ${totalDeleted}/${args[0]} messages!`))
        }).catch(er => {
            sent.edit(ErrorEmbed(`An error occurred when trying to delete messages! The error has been logged. Although we did successfully delete ${totalDeleted}/${args[0]} messages!`))
            logger.error(`Error on purge (args: ${args.join(" ")}) | Error: ${er}`)
        })       
    },

    config: {
        command: "purge",
        aliases: [],
        description: "Deletes <amount> amount of messages in the current channel.",
        permissions: ["MANAGE_MESSAGES"],
        usage: `purge <amount (0-1000)>`,
        requiredModules: [modules.MODERATION]
    }
}