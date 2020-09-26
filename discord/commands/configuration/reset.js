const Discord = require("discord.js")
const { utils } = require("../../../globals");
const { guildOptionsOf } = require('../../../utils/dbUtils');
const { InfoEmbed, NoPermsEmbed, ErrorEmbed, RedEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        
        if(message.guild.owner.id != message.member.id) return message.channel.send(NoPermsEmbed().setFooter("This command is restricted to the Guild Owner!"))

        const guildOptions = guildOptionsOf(message.guild)

        await guildOptions.resetEverything()

        message.channel.send(RedEmbed("✂ Reset", "Everything has been reset!"))
    },

    config: {
        command: "reset",
        aliases: [],
        description: "Resets everything for this guild. Only guild owners can use this command!",
        permissions: ["ADMINISTRATOR"],
        usage: `reset`
    }
}