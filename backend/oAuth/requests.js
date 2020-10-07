const fetch = require("node-fetch");
const { discordBaseUrl } = require("../constants")

/**
 * 
 * @typedef {Object} GuildObject
 * @property {Array} features
 * @property {String} icon
 * @property {String} id
 * @property {String} name
 * @property {Boolean} owner
 * @property {String} permissions
 */

module.exports = {

    /* Guilds */
    /**
     * 
     * @returns {Promise<Array<GuildObject>>}
     */
    getAllGuilds: function(token, token_type) {
        return new Promise((resolve, reject) => {
            fetch(`${discordBaseUrl}/users/@me/guilds`, {
                method: "GET",
                headers: {
                    "Authorization": `${token_type} ${token}`
                }
            }).then(res => res.json()).then(res => {
                resolve(res);
            }).catch(_ => {
                reject("Discord API Error");
            })
        })
    }

}