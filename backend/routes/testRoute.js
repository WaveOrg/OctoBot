module.exports = {
    handler(socket, payload) {
        respond(socket, payload, { message: "Welcome", yourPayload: payload })
    },

    path: "/testRoute"
}

function respond(socket, _payload, payload) {
    socket.emit("/testRoute", {
        _path: "/testRoute",
        _payload,
        ...payload
    })
}