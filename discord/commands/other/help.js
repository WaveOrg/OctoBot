const Discord = require("discord.js")
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const { prefix } = require("../../../config.json")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        switch(args[0] == null) {
            case true: 
                const fields = [];

                client.commands.forEach(command => {
                    const uppercaseCate = command.category.charAt(0).toUpperCase() + command.category.slice(1);

                    if(!fields[uppercaseCate]) 
                        fields[uppercaseCate] = {inline: true, name: uppercaseCate, value: ""};
                    
                    if(!fields[uppercaseCate].value.includes(`\`${command.config.command}\``)) 
                        fields[uppercaseCate].value += `\`${command.config.command}\` `
                });

                message.channel.send(InfoEmbed("🖨 All Commands", "Use `" + prefix + "help [command name]` for more info on a command.")
                    .addFields(Object.values(fields).map(v => v))
                )
                break;
            
            case false:

                const command = client.commands.get(args[0].toLowerCase());
                if(!command) return message.channel.send(ErrorEmbed("Unknown Command"));

                message.channel.send(InfoEmbed(`Info about: \`${args[0].toLowerCase()}\``, command.config.description)
                    .addField("Usage", `\`${command.config.usage.replace(/{{PREFIX}}/g, prefix)}\``, true)
                    .addField("Aliases", command.config.aliases.length != 0? command.config.aliases.map(alias => `\`${alias}\` `) : "None", true)
                    .addField("Permissions", command.config.permissions.length != 0? command.config.permissions.map(perm => `\`${perm}\` `) : "None", true)
                )

                break;
        }
    },

    config: {
        command: "help",
        aliases: [],
        description: "View info about each command!",
        permissions: [],
        usage: `{{PREFIX}}help [command name]`
    }
}