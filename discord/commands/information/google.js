const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed, RedEmbed } = require('../../../utils/utils')
const { userDataOf } = require("../../../utils/dbUtils")

const captureWebsite = require('capture-website');

// this is max's idea

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!args[0]) {
            message.channel.send(ErrorEmbed(`Usage: \`${this.config.usage}\``));
            return;
        }

        const params = new URLSearchParams();
        params.set('q', args.join(" "))

        var url = `https://google.com/search?${params}`
        
        const sent = await message.channel.send(RedEmbed('<a:loading:752246174550982728> Taking a picture', '').setFooter("This may take up to 60 seconds."))
    
        const isPremium = await userDataOf(message.author).isPremium()

        captureWebsite.buffer(url, {
            width: isPremium ? 1920 : 640,
            height: isPremium ? 1280 : 480,
            launchOptions: {
                args: ['--proxy-server=http://168.119.110.161:3128']
            },
        }).then(img => {
                const attachment = new Discord.MessageAttachment(img, 'google.png')
                message.channel.send(InfoEmbed('📚 Google Results', `Google results for ${args.join(" ")}`).setFooter("Premium users can take Full HD Pictures of websites!").attachFiles(attachment).setImage(`attachment://google.png`) );
        
                sent.delete()
        }).catch(error => {
            
            if(error.stack.includes('Navigation timeout of')) {
                sent.edit(ErrorEmbed('Uh oh! The messenger took too long to respond! (Timeout)'))
            } else if(error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
                sent.edit(ErrorEmbed('Uh oh! I cannot find that site anywhere in the ocean! Double check that link! (net::ERR_NAME_NOT_RESOLVED)'))
            } else if(error.message.includes('net::ERR_TUNNEL_CONNECTION_FAILED')) {
                sent.edit(ErrorEmbed(`Uh oh! I was unable to load that site!`).setFooter("You will also see this error when attempting to view NSFW websites."))   
            } else {
                sent.edit(ErrorEmbed('Uh oh! It seems like a shark ate the ethernet cable! I was unable to reach that site! `' + error.message + '`'))
            }

            logger.error(`SS Error (${url}): ${error.message}`)
        })
 
    },

    config: {
        command: "google",
        aliases: ["search"],
        description: "Screenshots google website",
        permissions: [],
        usage: `google <search term>`,
        cooldown: {
            time: 60000,
            premiumBypassable: true
        }
    }
}