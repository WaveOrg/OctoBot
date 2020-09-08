const { prefix } = require("../../config.json");
const { utils, settings, tracker, statcord, logger } = require("../../globals");

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").Message} message 
     */
    async run(client, message) {
        if(message.author.bot) return;
        if(message.channel.type != "text") return;

        if(!message.content.toLowerCase().startsWith(prefix)) return;

        const arguments = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = arguments.shift().toLowerCase();

        let cmd = client.commands.get(command);
        if(!cmd) return

        statcord.postCommand(command, message.author.id)

        if(cmd.config.permissions && cmd.config.permissions.filter(perm => message.member.hasPermission(perm)).length != cmd.config.permissions.length) {
            return message.channel.send(utils.NoPermsEmbed())
        }


        if(message.author.id == "715223401169551440") return;
        
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
