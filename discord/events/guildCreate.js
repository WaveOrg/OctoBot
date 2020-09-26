const { logger } = require('../../globals')
const GuildOptions = require("../../database/models/GuildOptions")

module.exports = {
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param  {import("discord.js").Guild} args 
     */
    async run(client, guild) {
        logger.debug(`Started guild proccessing for ${guild.name}`)
        const foundGuild = await GuildOptions.findOne({ guildId: guild.id.toString() })
        if(foundGuild) {
            logger.debug(`Guild ${guild.name} found. Skipped.`)
            return;
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
        
    },
    config: {
        name: "Guild Create",
        type: "guildCreate"
    }
}
