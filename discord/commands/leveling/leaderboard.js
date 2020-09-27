const Discord = require("discord.js");
const { guildLevelingOf } = require("../../../utils/dbUtils");
const { InfoEmbed } = require("../../../utils/utils");

module.exports = {
    /**
Lm
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        const guildLeveling = guildLevelingOf(message.guild, message.author);

        const topRanked = (await guildLeveling.getAllFromGuild()).sort((a, b) => {
            if(a.level < b.level) return 1;

            if(a.level > b.level) return -1;

            if(a.level == b.level) {
                if(a.xp < b.xp) return 1;
    
                if(a.xp > b.xp) return -1;
            }

            return 0;
        }).splice(0, 10);
        
        const embed = InfoEmbed("Leaderborad")
        let description = `Showing Top ${topRanked.length} people in ${message.guild.name}\n\n`;

        for(let i = 0; i < topRanked.length; i++) {
            description += `${i + 1}. <@${topRanked[i].userId}> - Level ${topRanked[i].level}\n`
        }

        embed.setDescription(description);

        message.channel.send(embed)
    },

    config: {
        command: "leaderboard",
        aliases: [],
        description: "View the guilds leaderboard",
        permissions: [],
        usage: `leaderboard`,
    }
}