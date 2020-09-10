const GuildOptionsContainer = require("../database/containers/GuildOptionsContainer")

module.exports = {

    /**
     *
     * @param {import("discord.js").Guild} guild
     * @returns {GuildOptionsContainer}
     */
    guildOptionsOf(guild) {
        return GuildOptionsContainer.from(guild);
    }

}