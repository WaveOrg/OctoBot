const Discord = require("discord.js")
const { ErrorEmbed, InfoEmbed } = require("../../../utils/utils")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[0]) return message.channel.send(ErrorEmbed("You need to specify a role name"))

        let name = args.join(" ").toLowerCase()

        let role = message.mentions.roles.first()
        if(!role) role = message.guild.roles.cache.find(r => r.id === args[0])
        if(!role) role = message.guild.roles.cache.find(r => r.name.toLowerCase() === name);
        if(!role) role = message.guild.roles.cache.find(r => r.name.toLowerCase().startsWith(name))
        if(!role) return message.channel.send(ErrorEmbed(`I can't find a role that goes by \`${name}\``))
        
        const embed = InfoEmbed("", `<@&${role.id}>`)
                        .setColor(role.hexColor)
                        .addField("Name", role.name, true)
                        .addField("Created at", role.createdAt.toString().replace(/\d+:\d+:\d+.*/, ''), true)
                        .addField("Position", role.position, true)
                        .addField("Color (Hex)", `${role.hexColor}`, true)
                        .addField("Color (Base 10)", role.color, true)
                        .addField("Hoisted", role.hoist ? "Yes" : "No", true)
                        .addField("Mention", `\`<@&${role.id}>\``, true)
                        .addField("Mentinable", role.mentionable ? "Yes" : "No", true)
                        .addField("Allowed permisions", role.permissions.toArray().map(permission => permission.split("_").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(" ")).join(", "))
                        .setFooter("ID: " + role.id)
                        .setTimestamp()

        message.channel.send(embed)

    },

    config: {
        command: "roleinfo",
        aliases: [],
        description: "View info about a role",
        permissions: [],
        usage: `roleinfo [mention/name/id]`,
    }
}