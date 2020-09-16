const _ = require("lodash")
const setValue = require("set-value")
const getValue = require("get-value")
const { userData } = require("./containerCache")
const UserData = require("../models/UserData")
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
 * @type {UserDataContainer}
 * @author Antony#9971
 */
module.exports = class UserDataContainer {

    /**
     * This constructor shouldn't be used, declared as deprecated because js doesn't have proper private properties
     * @param {import("discord.js").Snowflake} userId
     * @deprecated
     */
    constructor(userId) {
        this.userId = userId;
    }

    /**
     *
     * @param {import("discord.js").User | import("discord.js").Snowflake} user
     */
    static from(user) {
        let userId;
        if(typeof user === "string") {
            userId = user;
        }
        userId = user.id
        return userData.has(userId) ? userData.get(userId) : new UserDataContainer(userId);
    }

    /**
     * 
     * @returns {Promise<Mongoose.Document>}
     */
    async ensureUser() {
        const foundUser = await UserData.findOne({ userId: this.userId })
        if(foundUser) return Promise.resolve();

        try {
            return new UserData({
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
            await this.ensureUser()
            resolve((await UserData.findOne({ userId: this.userId })))
        })
    }

    /**
     *
     * @param { String } property
     * @returns {Promise<unknown>}
     */
    getProperty(property) {
        return new Promise(async resolve => {
            await this.ensureUser()
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
            await this.ensureUser()
            resolve((await UserData.updateOne({ userId: this.userId }, update)))
        })
    }

    /**
     *
     * @returns {Promise<String>}
     */
    async isPremium() {
        return this.getProperty("premium");
    }

    /**
     *
     * @param {String} prefix
     * @deprecated
     */
    async setPremium(premiumState) {
        return this.setProperty("premium", premiumState);
    }

    async enablePremium() {
        return new Promise(async resolve => {
            if(!(await this.isPremium())) resolve(this.setPremium(true))
        })
    }

    async disablePremium() {
        return new Promise(async resolve => {
            if((await this.isPremium())) resolve(this.setPremium(false))
        })
    }

    async togglePremium() {
        return new Promise(async resolve => {
            if((await this.isPremium())) resolve(this.setPremium(false))
            else resolve(this.setPremium(true))
        })
    }

    /**
     * 
     * @returns {Promise<String>}
     */
    async getRankCard() {
        return this.getProperty("rankCard")
    }

    /**
     * 
     * @param {String} imageBase64 
     */
    async setRankCard(imageBase64) {
        return this.setProperty("rankCard", imageBase64)
    }
    
    async resetEverything() {
        return this.setPropertyWithObject(omitDeep(new UserData({
            userId: this.userId
        }), ["_id", "__v"]))
    }

}