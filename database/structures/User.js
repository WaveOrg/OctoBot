const Discord = require("discord.js")
const UserDataContainer = require("../containers/UserDataContainer")
const GuildLevelingContainer = require("../containers/GuildLevelingContainer")

Discord.Structures.extend("User", GuildMember => {
    class DatabaseGuild extends GuildMember {

        /**
         * 
         * @param {Discord.Client} client 
         * @param {object} data 
         */
        constructor(client, data) {
            super(client, data)
        }

        
        getData() {
            return UserDataContainer.from(this);
        }

        /**
         * 
         * @param {Discord.Guild} guild 
         */
        getLevelingIn(guild) {
            return GuildLevelingContainer.from(guild, this)
        }

    }

    return DatabaseGuild;
});