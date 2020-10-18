const moment = require('moment');

// Kinda ugly, but moment doesn't have .format for dutations for some stupid reason
moment.duration.fn.format = function (input) {
    var output = input;
    var milliseconds = this.asMilliseconds();
    var totalMilliseconds = 0;
    var replaceRegexps = {
        years: /Y(?!Y)/g,
        months: /M(?!M)/g,
        weeks: /W(?!W)/g,
        days: /D(?!D)/g,
        hours: /H(?!H)/g,
        minutes: /m(?!m)/g,
        seconds: /s(?!s)/g,
        milliseconds: /S(?!S)/g
    }
    var matchRegexps = {
        years: /Y/g,
        months: /M/g,
        weeks: /W/g,
        days: /D/g,
        hours: /H/g,
        minutes: /m/g,
        seconds: /s/g,
        milliseconds: /S/g
    }
    for (var r in replaceRegexps) {
        if (replaceRegexps[r].test(output)) {
            var as = 'as'+r.charAt(0).toUpperCase() + r.slice(1);
            var value = new String(Math.floor(moment.duration(milliseconds - totalMilliseconds)[as]()));
            var replacements = output.match(matchRegexps[r]).length - value.length;
            output = output.replace(replaceRegexps[r], value);

            while (replacements > 0 && replaceRegexps[r].test(output)) {
                output = output.replace(replaceRegexps[r], '0');
                replacements--;
            }
            output = output.replace(matchRegexps[r], '');

            var temp = {};
            temp[r] = value;
            totalMilliseconds += moment.duration(temp).asMilliseconds();
        }
    }
    return output;
}

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

        this.formattedLength = lavalinkResponse.info.length ? `${moment.duration(this.lengthMS).format("H:mm:ss")}` : "Unknown"

        this.source = source;
        this.requestedBy = requestedBy || { id: null, tag: "Unknown", username: "Unknown" };
    }
}