const { dataContains } = require("../utils/utils");
const { verify } = require("../utils/jwt");
const { userDataOf } = require("../../utils/dbUtils")

/**
 * 
 * @param {import("../core/SocketRequest")} req 
 * @param {Function} next
 */
module.exports = async (req, next) => {
    if(!dataContains(req.payload, "token")) return req.respondBadRequest("No token provided")
    const token = req.payload.token;
    const verifiedToken = verify(token);
    if(!verifiedToken.valid) return req.respondUnauthorized("Invalid token")

    req.user = verifiedToken;
    req.user.isPremium = await userDataOf(verifiedToken.discordData.id).isPremium();
    
    delete req.user["valid"];
    delete req.user["iat"];
    delete req.user["exp"];
    next()
}