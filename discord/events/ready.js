const { logger, statcord } = require("../../globals");
const chalk = require("chalk")

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {string[]} args 
     */
    async run(client, ...args) {
        statcord.autopost();
        logger.log(`${chalk.blueBright("[Discord]")} StatCord auto-post started.`)

        logger.log(`${chalk.blueBright("[Discord]")} ${client.user.username} is ready! I am in ${client.guilds.cache.size} guilds with ${client.users.cache.size} users.`);
    },
    config: {
        name: "Ready",
        type: "ready"
    }
}
