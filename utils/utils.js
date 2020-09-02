const discord = require("discord.js")

module.exports = {
    InfoEmbed(title, desc) {
        return new discord.MessageEmbed().setTitle(title).setDescription(desc).setColor("12cad6")
    },

    ErrorEmbed(desc) {
        return new discord.MessageEmbed().setTitle("<:no:750451799609311412> Error").setDescription(desc).setColor("f04747")
    },

    NoPermsEmbed() {
        return new discord.MessageEmbed().setTitle("<:no:750451799609311412> Insufficient Permissions").setDescription("You do not have permission to run this command!").setColor("fa1616")
    },

    /**
     * 
     * @param {number} progress
     * @param {number} total
     * @param {string?} text
     * @returns {string}
     */
    generateProgressBar(progress, total, text) {
        let returnStr = '['
        for(const {} of Array(progress).keys()) returnStr += '▰';
        for(const {} of Array(total - progress).keys()) returnStr += '▱';

        returnStr += ']' + (text? ` - ${text}` : "")

        return returnStr;
    },

    scale: (number, oldMin, oldMax, newMin, newMax) => (((newMax - newMin) * (number - oldMin)) / (oldMax - oldMin)) + newMin
}