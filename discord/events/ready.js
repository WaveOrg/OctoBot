const { logger, statcord } = require("../../globals");
const GuildOptions = require("../../database/models/GuildOptions")
const chalk = require("chalk")

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {string[]} args 
     */
    async run(client, ...args) {
        //statcord.autopost();
        //logger.debug(`${chalk.blueBright("[Discord]")} StatCord auto-post started.`)

        logger.logDiscord(client, `${client.user.username} is ready! I am in ${client.guilds.cache.size} guilds with ${client.users.cache.size} users.`);
        
        for(let guildArr of client.guilds.cache) {
            const guild = guildArr[1];
            logger.debug(`Started guild proccessing for ${guild.name}`)
            const foundGuild = await GuildOptions.findOne({ guildId: guild.id.toString() })
            if(foundGuild) {
                logger.debug(`Guild ${guild.name} found. Skipped.`)
                continue;
            }
            const newGuildOptions = new GuildOptions({
                guildId: guild.id.toString()
            });

            try {
                logger.debug(`Adding guild ${guild.name} to the database.`);
                await newGuildOptions.save();
            } catch(err) {
                logger.error(`Adding guild ${guild.name} to the database failed.`);
            }
        }
    },
    config: {
        name: "Ready",
        type: "ready"
    }
}
