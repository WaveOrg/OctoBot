const _ = require("lodash")
const setValue = require("set-value")
const getValue = require("get-value")
const GuildLeveling = require("../models/GuildLeveling")
const { logger } = require("../../globals")
const { Mongoose } = require("mongoose")

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
 * @type {GuildLevelingContainer}
 */
module.exports = class GuildLevelingContainer {

    /**
     * This constructor shouldn't be used, declared as deprecated because js doesn't have proper private properties
     * @param {import("discord.js").Snowflake} userId
     * @deprecated
     */
    constructor(guildId, userId) {
        this.guildId = guildId;
        this.userId = userId;
    }

    /**
     *
     * @param {import("discord.js").User | import("discord.js").Snowflake} user
     */
    static from(guild, user) {
        let guildId;
        if(typeof guild === "string") {
            guildId = guild;
        }
        if(typeof guild === "number") {
            guildId= guild.toString()
        }
        guildId = guild.id

        let userId;
        if(typeof user === "string") {
            userId = user;
        }
        if(typeof user === "number") {
            userId= user.toString()
        }
        userId = user.id
        return new GuildLevelingContainer(guildId, userId);
    }

    /**
     * 
     * @returns {Promise<Mongoose.Document>}
     */
    async ensureLevelingUser() {
        const foundLevelingUser = await GuildLeveling.findOne({ guildId: this.guildId, userId: this.userId })
        if(foundLevelingUser) return Promise.resolve();

        try {
            return new GuildLeveling({
                guildId: this.guildId,
                userId: this.userId
            }).save()
        } catch(err) {
            logger.error(err)
        }
    }

    /**
     * 
     * @returns {Primise<Mongoose.Document>}
     */
    getFromDatabase() {
        return new Promise(async resolve => {
            await this.ensureLevelingUser()
            resolve((await GuildLeveling.findOne({ guildId: this.guildId, userId: this.userId })))
        })
    }

    /**
     *
     * @param { String } property
     * @returns {Promise<unknown>}
     */
    getProperty(property) {
        return new Promise(async resolve => {
            await this.ensureLevelingUser()
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
            await this.ensureLevelingUser()
            resolve((await GuildLeveling.updateOne({ guildId: this.guildId, userId: this.userId }, update)))
        })
    }

    async getXp() {
        return this.getProperty("xp")
    }

    async setXp(xp) {
        return this.setProperty("xp", xp)
    }

    async addXp(xp) {
        return new Promise(async resolve => {
            const currentXp = await this.getXp()
            resolve(await this.setXp(currentXp + xp))
        })
    }

    async getLevel() {
        return this.getProperty("level")
    }

    async setLevel(level) {
        return this.setProperty("level", level)
    }

    async levelUp() {
        return new Promise(async resolve => {
            const currentLevel = await this.getLevel()
            await this.setXp(0)
            resolve(await this.setLevel(currentLevel + 1))
        })
    }
    
    async resetEverything() {
        return this.setPropertyWithObject(omitDeep(new GuildLeveling({
            guildId: this.guildId,
            userId: this.userId
        }), ["_id", "__v"]))
    }

}