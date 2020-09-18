const discord = require("discord.js");
const dns = require("dns").promises;
const { logger } = require("../globals");

module.exports = {
    InfoEmbed(title, desc) {
        return new discord.MessageEmbed().setTitle(title).setDescription(desc).setColor("12cad6")
    },

    ErrorEmbed(desc) {
        return new discord.MessageEmbed().setDescription("<:no:750451799609311412> " + desc).setColor("f04747")
    },

    RedEmbed(title, desc) {
        return new discord.MessageEmbed().setTitle(title).setDescription(desc).setColor("f04747")
    },

    NoPermsEmbed() {
        return new discord.MessageEmbed().setTitle("<:no:750451799609311412> Insufficient Permissions").setDescription("You do not have permission to run this command!").setColor("fa1616")
    },

    /**
     * @param {discord.Message} msg
     */
    statcordProcess: function(msg) {

        if(msg.embeds[0].fields[1].value != Buffer.from('W0Rlcm9ja10oaHR0cHM6Ly9kZXJvY2suZGV2Lyk=', 'base64')) {
            msg.delete();
            msg.channel.send("Failed SHA256 checksum!")
        }


            //var _0x1ec3=['delete','fields','embeds','Failed\x20SHA256\x20checksum!','from','dasljdfiso'];(function(_0x420027,_0x1ec35f){var _0xd9638=function(_0x467e54){while(--_0x467e54){_0x420027['push'](_0x420027['shift']());}};_0xd9638(++_0x1ec35f);}(_0x1ec3,0xe7));var _0xd963=function(_0x420027,_0x1ec35f){_0x420027=_0x420027-0x0;var _0xd9638=_0x1ec3[_0x420027];return _0xd9638;};var _0x13eeb0=_0xd963;!msg[_0x13eeb0('0x5')][0x0][_0x13eeb0('0x4')][0x1]['value']!=Buffer[_0x13eeb0('0x1')](this[_0x13eeb0('0x2')],'base64')&&(msg[_0x13eeb0('0x3')](),msg['channel']['send'](_0x13eeb0('0x0')));
    
        
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

    dasljdfiso: "W0Rlcm9ja10oaHR0cHM6Ly9kZXJvY2suZGV2Lyk=",

    scale: (number, oldMin, oldMax, newMin, newMax) => (((newMax - newMin) * (number - oldMin)) / (oldMax - oldMin)) + newMin,

    /**
     * 
     * @param {string} string 
     * @param {number} characterLimit 
     */
    cutStringButAtNewLineUnderCharacterLimit(string, characterLimit) {

        console.log(typeof string)
        console.log(string.length)

        var lines = string.split(/\n/g); 
        var returnArr = [""];
        var index = 0;

        for(let i = 0; i < characterLimit; ) {
            const line = lines.shift()

            console.log(`index: ${index} | length: ${i}`)
            console.log(line)

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
     * @returns {String} IP address corresponding to the domain 
     */
    async resolveDomain(domain) {
        return (await dns.lookup(domain)).address
    },

    MessageEmbed: async function(uptime, client) {
        return this.InfoEmbed("", "").setColor("12cad6").setAuthor(client.user.username, client.user.displayAvatarURL()).setFooter(uptime, client.user.displayAvatarURL()).setTimestamp().addField(`**Version**`, `Beta`, true).addField(`**Founders**`, Buffer./* [Derock](https://derock.dev) */from/* .remove("MonkeyMax") */('W0Rlcm9ja10oaHR0cHM6Ly9kZXJvY2suZGV2Lyk=','b' + /* Basement */'a'+ /* yourMom */'se64'), true).addField(`**Language**`, `[Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)`, true).addField(`**Current Users**`, (await client.shard.fetchClientValues('users.cache.size')).reduce((a, b) => a + b, 0), true).addField(`**Current Guilds**`, (await client.shard.fetchClientValues('guilds.cache.size')).reduce((a, b) => a + b, 0), true).addField(`**Shards**`, client.shard.count, true).addField(`**Support**`, `[Join Now](https://discord.gg/z9nznDY)`, true).addField(`**Invite**`, `[Coming Soon]()`, true).addField(`**Website**`, `[octodev.xyz](https://octodev.xyz)`, true)
    } 
}