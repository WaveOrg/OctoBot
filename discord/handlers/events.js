const fs = require("fs").promises;
const chalk = require("chalk");

/**
 * 
 * @param {import("discord.js").Client} client 
 */
module.exports = async (client) => {
    const { logger } = require("../../globals");

    let eventsDir = (await fs.readdir("./discord/events")).filter(file => file.endsWith(".js"));
    
    for(let file of eventsDir) {
        const event = require(`../events/${file}`);

        const eventConfig = event.config;

        if(!eventConfig || !eventConfig.name || !eventConfig.type || !event.run) {
            logger.error(`${eventConfig.name || file} failed to load`);
            continue;
        }

        client.on(event.config.type, (...args) => event.run(client, ...args));
        
        if(client.shard.ids[0] === 0) logger.logDiscord(client, `Loaded event: ${event.config.name}`)
    }
}