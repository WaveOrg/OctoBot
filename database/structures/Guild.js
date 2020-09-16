const Discord = require("discord.js");
const GuildOptionsContainer = require("../containers/GuildOptionsContainer");

Discord.Structures.extend("Guild", Guild => {
    class DatabaseGuild extends Guild {

        /**
         * 
         * @param {Discord.Client} client 
         * @param {object} data 
         */
        constructor(client, data) {
            super(client, data)
        }

        getOptions() {
            return GuildOptionsContainer.from(this);
        }

    }

    return DatabaseGuild;
});