const dns = require("dns").promises;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * 
 * @returns {JSON} A bunch of utility functions
 */
module.exports = {

    /**
     * 
     * @param {Date} date
     * @param {Boolean} time
     * @returns  {String} Formatted Date
     */
    formatDate(date, time) {
        if(time) {
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();

            return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}`;
        }

        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();

        if(dd < 10) dd = `0${dd}`
        if(mm < 10) mm = `0${mm}`

        return `${dd}-${mm}-${yyyy}`
    },

    /**
     * 
     * @param  {...JSON} json
     * @returns {JSON} Final concatinated JSON
     */
    concatJson(...jsons) {
        let finalJson = {};

        for(let json of jsons) for(let key in json) finalJson[key] = json[key]
        
        return finalJson
    },

    /**
     * 
     * @param {Express.Response} res 
     * @param {...JSON} data
     */
    sendBadRequest(res, ...data) {
        res.status(400).json(this.concatJson({
            status: 400,
            message: "Bad Request"
        }, ...data))
    },

    /**
     * 
     * @param {Express.Response} res 
     * @param {...JSON} data
     */
    sendUnauthorized(res, ...data) {
        res.status(401).json(this.concatJson({
            status: 401,
            message: "Unauthorized"
        }, ...data))
    },

    /**
     * 
     * @param {Express.Response} res
     * @param {JSON} data
     */
    sendOk(res, ...data) {
        res.status(200).json(this.concatJson({
            status: 200
        }, ...data))
    },

    /**
     * 
     * @param {Express.Response} res
     * @param {JSON} data
     */
    sendCreated(res, ...data) {
        res.status(201).json(this.concatJson({
            status: 201
        }, ...data))
    },

    /**
     * 
     * @param {Object} data
     * @param  {...String} values
     * @returns {Boolean}
     */
    dataContains(data, ...values) {
        for(let value of values) if(!data.hasOwnProperty(value)) return false
        
        return true;
    },

    /**
     * 
     * @param {Mongoose.Model} model
     * @returns {JSON}
     */
    async modelValid(model) {
        let options = _.mapValues(model.schema.paths, value => value.options)

        let json = {}

        for(let [key, value] of Object.entries(options)) {
            if(key.startsWith("_")) continue;

            if(value.required) {
                if(!model[key]) {
                    if(!json["missing"]) json["missing"] = []
                    json["missing"].push(key)
                    continue;
                }
            }

            if(value.unique) {
                let field = key; 
                let criteria = {}; criteria[field] = model[field]
                let item = await model.constructor.findOne(criteria).exec()

                if(item) {
                    if(!json["notUnique"]) json["notUnique"] = []
                    json["notUnique"].push(field)
                }
            }

            if(value.min) {
                if(model[key].length < value.min) {
                    if(!json["tooLow"]) json["tooLow"] = []
                    json["tooLow"].push(key)
                }
            }

            if(value.max) {
                if(model[key].length > value.max) {
                    if(!json["tooHigh"]) json["tooHigh"] = []
                    json["tooHigh"].push(key)
                }
            }
        }

        json["valid"] = _.isEmpty(json)
        return json
    },

    /**
     * 
     * @param {String} domain
     * @returns {String} IP address corresponding to the domain 
     */
    async resolveDomain(domain) {
        return (await dns.lookup(domain)).address
    },

    /**
     * 
     * @param {String} plain
     * @returns {String} BCrypt hashed version of plain 
     */
    async hashBCrypt(plain) {
        return await bcrypt.hash(plain, 10)
    },

    /**
     * 
     * @param {String} plain 
     * @param {String} hash 
     * @returns {Boolean} Returns true if fields match, false if not
     */
    async compareBCryptHash(plain, hash) {
        return await bcrypt.compare(plain, hash)
    },

    /**
     * 
     * @param {Mongoose.Model} user 
     * @returns {String} JWT Token for user
     */
    generateJWT(user) {
        return jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email
        }, "jy1J8jpuJn1Q9Mrb1HjQc0GqezmwwASydEDMMc4c3GsOkfbXLpTH0feYdVSSqPFB", { expiresIn: "48h" })
    },

    /**
     * 
     * @param {String} token
     * @returns {JSON} Token data if valid 
     */
    validateToken(token) {
        try {
            return this.concatJson({ valid: true }, jwt.verify(token, "jy1J8jpuJn1Q9Mrb1HjQc0GqezmwwASydEDMMc4c3GsOkfbXLpTH0feYdVSSqPFB"))
        } catch (err) {
            return { valid: false }
        }
    }

}
