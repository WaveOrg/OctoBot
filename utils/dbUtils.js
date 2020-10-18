module.exports = {

    /**
     *
     * @param {import("discord.js").Guild} guild
     * @returns {GuildOptionsContainer}
     */
    guildOptionsOf: function(guild) {
        const GuildOptionsContainer = require("../database/containers/GuildOptionsContainer");
        return GuildOptionsContainer.from(guild);
    },

    /**
     * 
     * @param {import("discord.js").User} user 
     * @returns {UserDataContainer}
     */
    userDataOf: function(user) {
        const UserDataContainer = require("../database/containers/UserDataContainer");
        return UserDataContainer.from(user)
    },

    /**
     * 
     * @param {import("discord.js").Guild} guild 
     * @param {import("discord.js").User} user 
     * @returns {GuildLevelingContainer}
     */
    guildLevelingOf: function(guild, user) {
        const GuildLevelingContainer = require("../database/containers/GuildLevelingContainer");
        return GuildLevelingContainer.from(guild, user)
    },

    /**
     * 
     * @param {Object} target
     * @param {Object} source
     * @param {String} rootElement
     * @returns {Array<String>}
     * 
     * ["asdf.asdf"]
     */
    findMissing: function(target, source, rootElement = "") {
        let missing = [];

        for(const key of Object.keys(target)) {
            if(!source.hasOwnProperty(key)) {
                missing.push(`${rootElement}${rootElement !== "" ? "." : ""}${key}`);
                continue;
            }

            if(!!target && !typeof target[key] === "object") {
                missing = missing.concat(findMissing(target[key], source[key], `${rootElement}${rootElement !== "" ? "." : ""}${key}`));
            }
        }

        return missing;
    }

}