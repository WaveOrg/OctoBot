module.exports = {

    /**
     * 
     * @param {import("socket.io").Socket} socket 
     * @param {import("../core/SocketRequest")} request 
     */
    handler(request) {
        request.respondOk({ message: "Welcome", yourPayload: request.payload })
    },

    path: "/testRoute"
}