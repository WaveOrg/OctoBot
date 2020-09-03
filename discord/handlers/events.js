const fs = require("fs").promises;
const chalk = require("chalk");
const { logger } = require("../../globals");

/**
 * 
 * @param {import("discord.js").Client} client 
 */
module.exports = async (client) => {
    let eventsDir = (await fs.readdir("./discord/events")).filter(file => file.endsWith(".js"));
    
    for(let file of eventsDir) {
        const event = require(`../events/${file}`);

        if(!event.config || !event.config.name || !event.config.type || !event.run) {
            logger.error(`${event.config.name || file} failed to load`);
            continue;
        }

        client.on(event.config.type, (...args) => event.run(client, ...args));
        logger.log(`${chalk.blueBright("[Discord]")} Loaded event: ${event.config.name}`)
    }
}