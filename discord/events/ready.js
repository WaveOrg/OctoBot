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
        statcord.autopost();
        logger.log(`${chalk.blueBright("[Discord]")} StatCord auto-post started.`)

        logger.log(`${chalk.blueBright("[Discord]")} ${client.user.username} is ready! I am in ${client.guilds.cache.size} guilds with ${client.users.cache.size} users.`);
        
        for(let guildArr of client.guilds.cache) {
            const guild = guildArr[1];
            console.log(`Started guild proccessing for ${guild.name}`)
            const foundGuild = await GuildOptions.findOne({ guildId: guild.id.toString() })
            if(foundGuild) {
                console.log(`Guild ${guild.name} found. Skipped.`)
                return;
            };
            const newGuildOptions = new GuildOptions({
                guildId: guild.id.toString()
            });

            try {
                console.log(`Adding guild ${guild.name} to the database.`);
                await newGuildOptions.save();
            } catch(err) {
                console.error(`Adding guild ${guild.name} to the database failed.`);
            }
        }
    },
    config: {
        name: "Ready",
        type: "ready"
    }
}
