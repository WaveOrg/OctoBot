const GuildOptionsContainer = require("../database/containers/GuildOptionsContainer")
const UserDataContainer = require("../database/containers/UserDataContainer");
const GuildLevelingContainer = require("../database/containers/GuildLevelingContainer");

module.exports = {

    /**
     *
     * @param {import("discord.js").Guild} guild
     * @returns {GuildOptionsContainer}
     */
    guildOptionsOf(guild) {
        return GuildOptionsContainer.from(guild);
    },

    /**
     * 
     * @param {import("discord.js").User} user 
     * @returns {UserDataContainer}
     */
    userDataOf(user) {
        return UserDataContainer.from(user)
    },

    /**
     * 
     * @param {import("discord.js").Guild} guild 
     * @param {import("discord.js").User} user 
     * @returns {GuildLevelingContainer}
     */
    guildLevelingOf(guild, user) {
        return GuildLevelingContainer.from(guild, user)
    }

}