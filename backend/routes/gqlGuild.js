const { graphql } = require("graphql")
const { schema, root } = require("../gql/guildSchema")

module.exports = {

    /**
     * 
     * @param {import("../core/SocketRequest")} request 
     */
    async handler(request) {
        if(!request.payload.query) return request.respondBadRequest("No Query Provided")
        graphql(schema, request.payload.query, root).then(response => {
            request.respondOk(response);
        }).catch(err => {
            request.respondBadRequest(err)
        })
    },

    path: "/gqlGuild"
}