const discord = require("discord.js");
const dns = require("dns").promises;
const { logger } = require("../globals");

module.exports = {
    InfoEmbed: function(title, desc) {
        return new discord.MessageEmbed().setTitle(title).setDescription(desc).setColor("12cad6")
    },

    ErrorEmbed: function(desc) {
        return new discord.MessageEmbed().setDescription("<:no:750451799609311412> " + desc).setColor("f04747")
    },

    RedEmbed: function(title, desc) {
        return new discord.MessageEmbed().setTitle(title).setDescription(desc).setColor("f04747")
    },

    NoPermsEmbed: function() {
        return new discord.MessageEmbed().setTitle("<:no:750451799609311412> Insufficient Permissions").setDescription("You do not have permission to run this command!").setColor("fa1616")
    },

    /**
     * 
     * @param {number} progress
     * @param {number} total
     * @param {string?} text
     * @returns {string}
     */
    generateProgressBar: function(progress, total, text) {
        let returnStr = '['
        for(const {} of Array(progress).keys()) returnStr += '▰';
        for(const {} of Array(total - progress).keys()) returnStr += '▱';

        returnStr += ']' + (text? ` - ${text}` : "")

        return returnStr;
    },

    dasljdfiso: "W0Rlcm9ja10oaHR0cHM6Ly9kZXJvY2suZGV2Lyk=",

    scale: (number, oldMin, oldMax, newMin, newMax) => (((newMax - newMin) * (number - oldMin)) / (oldMax - oldMin)) + newMin,

    /**
     * 
     * @param {string} string 
     * @param {number} characterLimit 
     */
    cutStringButAtNewLineUnderCharacterLimit: function(string, characterLimit) {

        var lines = string.split(/\n/g); 
        var returnArr = [""];
        var index = 0;

        for(let i = 0; i < characterLimit; ) {
            const line = lines.shift()

            if(line) {
                i += line.length;

                if(i < characterLimit) {
                    returnArr[index] += line + '\n'
                } else {
                    i = 0;
                    index++;
                    
                    returnArr[index] = line + '\n'
                }
            } else break;
        }

        return returnArr;
    },
    
    /**
     * 
     * @param {String} domain
     * @returns {Promise<String>} IP address corresponding to the domain 
     */
    resolveDomain: async function(domain) {
        return (await dns.lookup(domain)).address
    },
}