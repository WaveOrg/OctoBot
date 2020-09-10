const setValue = require("set-value")
const getValue = require("get-value")
const { guildOptions } = require("./containerCache")
const GuildOptions = require("../models/GuildOptions")

// Normally Array.prototype.push() returns the length, so this betterPush returns the new array, allowing for a little cleaner code imo.
Array.prototype.betterPush = function(x) {
    this.push(x);
    return this;
};

/**
 * This class is here to make getting data from database
 * a bit more abstract, will implement caching later.
 * Things that are marked as @deprecated in this class
 * shouldn't really be user and there is probably a
 * much nicer way of doing whatever is supposed to be
 * done.
 * @type {GuildOptionsContainer}
 */
module.exports = class GuildOptionsContainer {

    /**
     * This constructor shouldn't be used, declared as deprecated because js doesn't have proper private properties
     * @param {import("discord.js").Guild} guild
     * @deprecated
     */
    constructor(guild) {
        this.guild = guild;
    }

    /**
     *
     * @param {import("discord.js").Guild} guild
     */
    static from(guild) {
        return guildOptions.has(guild.id) ? guildOptions.get(guild.id) : new GuildOptionsContainer(guild);
    }

    /**
     *
     * @param { String } property
     * @returns {Promise<unknown>}
     */
    getProperty(property) {
        return new Promise(async resolve => {
            const result = await GuildOptions.findOne({ guildId: this.guild.id })
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
        return GuildOptions.updateOne({ guildId: this.guild.id }, update)
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
            return this.setActiveModules(activeModules.splice(activeModules.indexOf(module), 1))
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
            activeModules.splice(activeModules.indexOf(module), 1);
            return this.setActiveModules(activeModules)
        }
    }

    /**
     *
     * @returns {Promise<WelcomeLeaveMessageContainer>}
     */
    async getWelcomeMessage() {
        return new Promise(async resolve => {
            resolve(new WelcomeLeaveMessageContainer(this, "welcome", (await this.getProperty("messages.welcome"))))
        })
    }

    /**
     *
     * @returns {Promise<WelcomeLeaveMessageContainer>}
     */
    async getLeaveMessage() {
        return new Promise(async resolve => {
            resolve(new WelcomeLeaveMessageContainer(this, "leave", (await this.getProperty("messages.leave"))))
        })
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
    getDataType() {
        return this.databaseResponse.dataType;
    }

    /**
     *
     * @param {string} dataType
     */
    async setDataType(dataType) {
        return new Promise(async resolve => {
            const current = await this.parentContainer.getProperty("messages");
            setValue(current, `${this.type}.dataType`, dataType)
            resolve((await this.parentContainer.setProperty("messages", current)));
        })
    }

    /**
     *
     * @returns {String}
     */
    getData() {
        return this.databaseResponse.data;
    }

    /**
     *
     * @param {String} data
     */
    async setData(data) {
        return new Promise(async resolve => {
            const current = await this.parentContainer.getProperty("messages");
            setValue(current, `${this.type}.data`, data)
            resolve((await this.parentContainer.setProperty("messages", current)));
        })
    }

}