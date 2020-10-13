module.exports = class SocketRequest {

    /**
     * 
     * @param {import("socket.io").Socket} socket 
     * @param {Object} requestPayload 
     */
    constructor(socket, requestRoute, requestPayload) {
        this.socket = socket;
        this.requestRoute = requestRoute;
        this.requestPayload = requestPayload;
    }

    get route() {
        return this.requestRoute;
    }

    get payload() {
        return this.requestPayload;
    }

    /**
     * 
     * @param {Number} status 
     * @param {Object} responsePayload 
     */
    respond(status, responsePayload) {
        this.socket.emit(this.requestRoute, {
            _path: this.requestRoute,
            _payload: this.requestPayload,
            status,
            ...responsePayload
        })
    }

    respondBadRequest(error) {
        this.respond(400, { error: error || "Bad Request" })
    }

    respondForbidden(error) {
        this.respond(403, { error: error || "Forbidden" })
    }

    respondUnauthorized (error) {
        this.respond(401, { error: error || "Unauthorized" })
    }

    respondNotFound(error) {
        this.respond(404, { error: error || "Not Found" })
    }

    respondRateLimited(retryAfter) {
        this.respond(429, { retryAfter })
    }

    respondOk(data, spread = true) {
        this.respond(200, spread && data ? { ...data } : { data: data || "Ok" })
    }

    respondNotOk(error) {
        this.respondBadRequest(data);
    }
}