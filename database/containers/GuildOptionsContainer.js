const _ = require("lodash")
const setValue = require("set-value")
const getValue = require("get-value")
const { guildOptions } = require("./containerCache")
const GuildOptions = require("../models/GuildOptions")
const { findMissing } = require("../../utils/dbUtils");
const { ReactionUserManager } = require("discord.js")

// Normally Array.prototype.push() returns the length, so this betterPush returns the new array, allowing for a little cleaner code imo.
Array.prototype.betterPush = function(value) {
    this.push(value);
    return this;
};

Array.prototype.remove = function(value) {
    const index = this.indexOf(value)
    if(index > -1) {
        this.splice(index, 1);
    }
    return this;
}

/**
 * 
 * @param {Object} object 
 * @param {Array<String>} keys 
 */
function omitDeep(object, keys) {
    return _.cloneDeepWith(object, (it) => {
        if(it && typeof it === "object") for(let key of keys) delete it[key]
    })
  }

/**
 * This class is here to make getting data from database
 * a bit more abstract, will implement caching later.
 * Things that are marked as @deprecated in this class
 * shouldn't really be user and there is probably a
 * much nicer way of doing whatever is supposed to be
 * done.
 * @type {GuildOptionsContainer}
 * @author Antony#9971
 */
module.exports = class GuildOptionsContainer {

    /**
     * This constructor shouldn't be used, declared as deprecated because js doesn't have proper private properties
     * @param {import("discord.js").Snowflake} guildId
     * @deprecated
     */
    constructor(guildId) {
        this.guildId = guildId;
    }

    /**
     * 
     * @returns {Promise<Mongoose.Document>}
     */
    async ensureGuild() {
        const foundGuild = await GuildOptions.findOne({ guildId: this.guildId })

        if(foundGuild) return Promise.resolve();

        try {
            return new GuildOptions({
                guildId: this.guildId
            }).save()
        } catch(err) {
            logger.error(err)
        }
    }

    /**
     *
     * @param {import("discord.js").Guild | import("discord.js").Snowflake} guild
     */
    static from(guild) {
        let guildId;
        if(typeof guild === "string") {
            guildId = guild;
        } else {
            guildId = guild.id
        }
        return guildOptions.has(guildId) ? guildOptions.get(guildId) : new GuildOptionsContainer(guildId);
    }

    /**
     * 
     * @returns {Promise<Mongoose.Document>}
     */
    getFromDatabase() {
        return new Promise(async resolve => {
            await this.ensureGuild();
            resolve(GuildOptions.findOne({ guildId: this.guildId }))
        })
    }

    /**
     *
     * @param { String } property
     * @returns {Promise<unknown>}
     */
    getProperty(property) {
        return new Promise(async resolve => {
            const result = await this.getFromDatabase()
            // Because dot notation and stuff
            resolve(getValue(result, property))
        })
    }

    /**
     *
     * @param {String} property
     * @param newValue
     * @returns {Promise<void>}
     */
    setProperty(property, newValue) {
        const obj = {};
        // Because dot notation and stuff
        setValue(obj, property, newValue)
        return this.setPropertyWithObject(obj)
    }

    /**
     *
     * @param {Object} update
     * @returns {Promise<void>}
     */
    setPropertyWithObject(update) {
        return new Promise(async resolve => {
            await this.ensureGuild()
            resolve(GuildOptions.updateOne({ guildId: this.guildId }, update))
        })
    }

    /**
     *
     * @returns {Promise<String>}
     */
    async getPrefix() {
        return this.getProperty("prefix");
    }

    /**
     *
     * @param {String} prefix
     */
    async setPrefix(prefix) {
        return this.setProperty("prefix", prefix);
    }

    /**
     *
     * @returns {Promise<Array<String>>}
     */
    async getActiveModules() {
        return this.getProperty("activeModules")
    }

    /**
     *
     * @param {Array<String>} activeModules
     * @deprecated
     */
    async setActiveModules(activeModules) {
        return this.setProperty("activeModules", activeModules)
    }

    /**
     *
     * @param {String} module
     * @returns {Promise<Boolean>}
     */
    async isModuleEnabled(module) {
        return new Promise(async resolve => {
            const activeModules = await this.getActiveModules();
            resolve(activeModules.includes(module))
        })
    }

    /**
     *
     * @param {String} module
     */
    async enableModule(module) {
        // Doesn't use isModuleEnabled for better code efficiency, less calls to database
        const activeModules = await this.getActiveModules();
        if (!activeModules.includes(module)) {
            return this.setActiveModules(activeModules.betterPush(module))
        }
        return Promise.resolve();
    }

    /**
     *
     * @param {String} module
     */
    async disableModule(module) {
        // Doesn't use isModuleEnabled for better code efficiency, less calls to database
        const activeModules = await this.getActiveModules();
        if (activeModules.includes(module)) {
            return this.setActiveModules(activeModules.remove(module))
        }
        return Promise.resolve();
    }

    /**
     *
     * @param {String} module
     */
    async toggleModule(module) {
        // Doesn't use isModuleEnabled, enableModule and disableModule for better code efficiency, less calls to database
        const activeModules = await this.getActiveModules();
        if (!activeModules.includes(module)) {
            return this.setActiveModules(activeModules.betterPush(module))
        } else {
            return this.setActiveModules(activeModules.remove(module))
        }
    }

    /**
     * 
     * @returns {Promise<Boolean>}
     */
    async isAutoRoleEnabled() {
        return (await this.getProperty("autoRole")).enabled;
    }

    /**
     * 
     * @returns {Promise<Stirng>}
     */
    async getAutoRoleId() {
        return (await this.getProperty("autoRole.roleId"));
    }

    async enableAutoRole(roleId = null) {
        roleId = !roleId ? "null" : roleId;
        const document = this.getFromDatabase();
        document.autoRole["enabled"] = true;
        document.autoRole["roleId"] = roleId;
        document.markModified("autoRole.roleId");
        document.markModified("autoRole.enabled");
        await document.save();
        return;
    }

    async disableAutoRole() {
        const document = await this.getFromDatabase();
        document.autoRole["enabled"] = false;
        document.autoRole["roleId"] = "null";
        document.markModified("autoRole.roleId");
        document.markModified("autoRole.enabled");
        await document.save();
        return;
    }

    async toggleAutoRole(roleId = null) {
        roleId = !roleId ? "null" : roleId;
        if(!(await this.isAutoRoleEnabled())) {
            return this.enableAutoRole(roleId);
        }

        return this.disableAutoRole();
    }

    /**
     *
     * @returns {Promise<WelcomeLeaveMessageContainer>}
     */
    async getWelcomeMessage() {
        return new Promise(async r => { r(new WelcomeLeaveMessageContainer(this, "welcome", (await this.getFromDatabase()))) })
    }

    /**
     *
     * @returns {Promise<WelcomeLeaveMessageContainer>}
     */
    async getLeaveMessage() {
        return new Promise(async r => { r(new WelcomeLeaveMessageContainer(this, "leave", (await this.getFromDatabase()))) })
    }


    async resetEverything() {
        return this.setPropertyWithObject(omitDeep(new GuildOptions({
            guildId: this.guildId
        }), ["_id", "__v"]))
    }

}

class WelcomeLeaveMessageContainer {

    /**
     *
     * @param {GuildOptionsContainer} parentContainer
     * @param {String} type
     * @param {Object} databaseResponse
     */
    constructor(parentContainer, type, databaseResponse) {
        this.parentContainer = parentContainer;
        this.type = type;
        this.databaseResponse = databaseResponse;
    }

    /**
     *
     * @returns {String}
     */
    getChannelId() {
        const channelId = this.databaseResponse.messages[this.type].channelId
        return channelId === "null" ? null : channelId
    }

    /**
     *
     * @param {String} channelId
     */
    setChannelId(channelId) {
        const current = this.databaseResponse;
        current.messages[this.type].channelId = !channelId ? "null" : channelId;
        current.markModified(`messages.${this.type}.channelId`);
        return current.save()
    }

    /**
     *
     * @returns {String}
     */
    getDataType() {
        return this.databaseResponse.messages[this.type].dataType;
    }

    /**
     *
     * @param {string} dataType
     */
    setDataType(dataType) {
        const current = this.databaseResponse;
        current.messages[this.type].dataType = dataType;
        current.markModified(`messages.${this.type}.dataType`);
        return current.save()
    }

    /**
     *
     * @returns {String}
     */
    getData() {
        return this.databaseResponse.messages[this.type].data;
    }

    /**
     *
     * @param {String} data
     */
    setData(data) {
        const current = this.databaseResponse;
        current.messages[this.type].data = data;
        current.markModified(`messages.${this.type}.data`);
        return current.save()
    }

}