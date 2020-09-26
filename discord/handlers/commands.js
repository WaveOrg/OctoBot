const { logger } = require("../../globals");
const chalk = require("chalk");

const fs = require("fs").promises;

/**
 * 
 * @param {import("discord.js").Client} client 
 */
module.exports = async (client) => {
    let eventsDir = (await fs.readdir("./discord/commands")).filter(file => !file.endsWith(".js"));
    
    for(let folder of eventsDir) {
        const category = (await fs.readdir(`./discord/commands/${folder}`)).filter(file => file.endsWith(".js"));

        for(let file of category) {
            const command = require(`../commands/${folder}/${file}`);

            command["category"] = folder;

            if(!command.config || !command.config.command || !command.config.aliases || !command.config.description || typeof command.config.admin == undefined || !command.run) {
                logger.error(`${command.config? command.config.command || file : file} failed to load`);
                continue;
            }

            client.commands.set(command.config.command, command);
            command.config.aliases.forEach(alias => {
                client.commands.set(alias, command);
            });
            if(client.shard.ids[0] === 0) logger.logDiscord(client, `Loaded command: ${folder} » ${command.config.command}`);
        }
    }
}