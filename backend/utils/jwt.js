const jwt = require("jsonwebtoken");
const { dataContains } = require("./utils");

module.exports = {

    /**
     * 
     * @param {String} token
     * @returns {Object}
     */
    verify: function(token) {
        try {
            let verified = jwt.verify(token, process.env.JWT_SECRET)
            if(!verified || !dataContains(verified, "access_token", "token_type", "discordData")) return { valid: false }
            return { valid: true, ...verified }
        } catch (_) {
            return { valid: false }
        }
    }

}