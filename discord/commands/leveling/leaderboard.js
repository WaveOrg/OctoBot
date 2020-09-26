const Discord = require("discord.js");
const { guildLevelingOf } = require("../../../utils/dbUtils")

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        const guildLeveling = guildLevelingOf(message.guild, message.author);

        const res = await guildLeveling.getAllFromGuild().sort((a, b) => {

        });
        console.log(res);
    },

    config: {
        command: "leaderboard",
        aliases: [],
        description: "View the guilds leaderboard",
        permissions: [],
        usage: `leaderboard`,
    }
}