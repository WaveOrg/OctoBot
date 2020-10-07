const verifyUser = require("../middleware/verifyUser");
const { getAllGuilds } = require("../oAuth/requests");

module.exports = {

    /**
     * 
     * @param {import("../core/SocketRequest")} req 
     */
    async handler(req) {
        delete req.user["valid"];
        delete req.user["iat"];
        delete req.user["exp"];
        
        getAllGuilds(req.user.access_token, req.user.token_type).then(guilds => {
            req.respondOk({ user: req.user, guilds });
        }).catch(err => {
            req.respondBadRequest(err);
        })
    },

    middleware: [verifyUser],
    path: "getUserGuilds"
}