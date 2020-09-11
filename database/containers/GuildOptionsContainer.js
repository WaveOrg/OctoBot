const _ = require("lodash")
const setValue = require("set-value")
const getValue = require("get-value")
const { guildOptions } = require("./containerCache")
const GuildOptions = require("../models/GuildOptions")

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
     * @returns {Primise<Mongoose.Document>}
     */
    getFromDatabase() {
        return GuildOptions.findOne({ guildId: this.guild.id })
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


    async resetEverything() {
        return this.setPropertyWithObject(omitDeep(new GuildOptions({
            guildId: this.guild.id
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
    getDataType() {
        return this.databaseResponse.dataType;
    }

    /**
     *
     * @param {string} dataType
     */
    async setDataType(dataType) {
        return new Promise(async resolve => {
            const current = await this.parentContainer.getFromDatabase();
            current.messages[this.type].dataType = dataType;
            current.markModified(`${this.type}.dataType`);
            current.save()
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
            const current = await this.parentContainer.getFromDatabase();
            current.messages[this.type].data = data;
            current.markModified(`${this.type}.data`);
            current.save()
        })
    }

}