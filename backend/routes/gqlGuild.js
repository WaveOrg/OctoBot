const { graphql } = require("graphql")
const { schema, root } = require("../gql/guildSchema")

module.exports = {

    /**
     * 
     * @param {import("../core/SocketRequest")} request 
     */
    async handler(request) {
        // Artificial lag, to demonstrate how it would maybe look on clients side, just for testing purposes
        await delay(200)
        if(!request.payload.query) return request.respondBadRequest("No Query Provided")
        graphql(schema, request.payload.query, root).then(response => {
            request.respondOk(response);
        }).catch(err => {
            request.respondBadRequest(err)
        })
    },

    path: "/gqlGuild"
}

function delay(millis) {
    return new Promise(r => setTimeout(r, millis));
}