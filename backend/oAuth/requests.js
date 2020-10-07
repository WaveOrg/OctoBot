const fetch = require("node-fetch");
const { discordBaseUrl } = require("../constants")

module.exports = {

    /* Guilds */
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