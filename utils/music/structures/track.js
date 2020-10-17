const moment = require('moment');

module.exports = class Track {
    /**
     * 
     * @param {Object} lavalinkResponse
     * @param {discord.User} requestedBy 
     * @param {string} source
     */
    constructor(lavalinkResponse, requestedBy, source) {
        /** @type {String} */
        this.title = lavalinkResponse.info.title || "No Title"; 
        /** @type {String} */
        this.author = lavalinkResponse.info.author || "No Author";
        /** @type {String} */
        this.identifier = lavalinkResponse.info.identifier;
        /** @type {String} */
        this.link = lavalinkResponse.info.uri;
        /** @type {number} */
        this.lengthMS = lavalinkResponse.info.length || Infinity;
        /** @type {String} */
        this.lavalinkID = lavalinkResponse.track;

        this.formattedLength = lavalinkResponse.info.length ? moment(this.lengthMS).format("h:mm:ss") : "Unknown"

        this.soruce = source;
        this.requestedBy = requestedBy || { tag: "Unknown", username: "Unknown" } ;
    }
}