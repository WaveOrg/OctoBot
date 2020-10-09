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

/**
 * 
 * @typedef {Object} CachedGuild
 * @property {Date} lastCached
 */


/**
 * 
 * @type {Map<String, CachedGuild>}
 */
const userGuilds = new Map();

setInterval(() => {
    for(let [_, cachedGuild] of userGuilds) if(cachedGuild.lastCached + 6000 >= Date.now()) userGuilds.delete(cachedGuild);
})

module.exports = {

    /* Guilds */
    /**
     * 
     * @returns {Promise<Array<GuildObject>>}
     */
    getAllGuilds: function(token, token_type) {
        return new Promise((resolve, reject) => {
            const fullToken = `${token_type} ${token}`;
            if(userGuilds.has(fullToken)) {
                if(userGuilds.get(fullToken).lastCached + 6000 <= Date.now()) userGuilds.delete(fullToken);
                else return resolve(userGuilds.get(fullToken));
            }
            fetch(`${discordBaseUrl}/users/@me/guilds`, {
                method: "GET",
                headers: {
                    "Authorization": fullToken
                }
            }).then(res => res.json()).then(res => {
                res.lastCached = Date.now();
                userGuilds.set(fullToken, res);
                resolve(res);
            }).catch(_ => {
                reject("Discord API Error");
            })
        })
    }

}