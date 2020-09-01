const discord = require("discord.js")

module.exports = {
    InfoEmbed(title, desc) {
        return new discord.MessageEmbed().setTitle(title).setDescription(desc).setFooter('OctoBot').setTimestamp().setColor("12cad6")
    },

    ErrorEmbed(desc) {
        return new discord.MessageEmbed().setTitle("❌ Error").setDescription(desc).setFooter('OctoBot').setTimestamp().setColor("f04747")
    },

    NoPermsEmbed() {
        return new discord.MessageEmbed().setTitle("❌ Insufficient Permissions").setDescription("You do not have permission to run this command!").setFooter('OctoBot').setTimestamp().setColor("fa1616")
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
        for(const {} of Array(progress - 1).keys()) returnStr += '▇';
        for(const {} of Array(total - progress + 1).keys()) returnStr += '-';

        returnStr += ']' + (text? ` - ${text}` : "")

        return returnStr;
    }
}