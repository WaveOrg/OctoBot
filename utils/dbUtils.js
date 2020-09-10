const GuildOptionsContainer = require("../database/containers/GuildOptionsContainer")
const UserDataContainer = require("../database/containers/UserDataContainer")

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
    }

}