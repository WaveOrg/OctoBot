const Discord = require("discord.js")
const GuildLevelingContainer = require("../containers/GuildLevelingContainer")

Discord.Structures.extend("GuildMember", GuildMember => {
    class DatabaseGuild extends GuildMember {

        /**
         * 
         * @param {Discord.Client} client 
         * @param {object} data 
         * @param {Discord.Guild} guild
         */
        constructor(client, data, guild) {
            super(client, data, guild)
        }

        getLeveling() {
            return GuildLevelingContainer.from(this.guild, this);
        }

    }

    return DatabaseGuild;
});