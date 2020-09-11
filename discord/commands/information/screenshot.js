const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed, RedEmbed } = require('../../../utils/utils')
const { userDataOf } = require("../../../utils/dbUtils")

const captureWebsite = require('capture-website');

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

        var url = (args.join(" ").startsWith('https://') || args.join(" ").startsWith('http://'))? args.join(' ') : `https://${args.join("  ")}`
        
        const sent = await message.channel.send(RedEmbed('<a:loading:752246174550982728> Taking a picture', '').setFooter("This may take up to 60 seconds."))
    
        const isPremium = await userDataOf(message.author).isPremium()

        captureWebsite.buffer(url, {
            width: isPremium ? 1920 : 640,
            height: isPremium ? 1280 : 480,
            launchOptions: {
                args: ['--proxy-server=http://ec2-52-14-24-237.us-east-2.compute.amazonaws.com:8443']
            }
        }).then(img => {
                const attachment = new Discord.MessageAttachment(img, 'website.png')
                message.channel.send(InfoEmbed('📸 Website Screenshot', `Screenshot of \`${url}\``).setFooter("Premium users can take Full HD Pictures of websites!").attachFiles(attachment).setImage(`attachment://website.png`) );
        
                sent.delete()
        }).catch(error => {
            
            if(error.stack.includes('Navigation timeout of')) {
                sent.edit(ErrorEmbed('Uh oh! The messenger took too long to respond! (Timeout)'))
            } else if(error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
                sent.edit(ErrorEmbed('Uh oh! I cannot find that site anywhere in the ocean! Double check that link! (net::ERR_NAME_NOT_RESOLVED)'))
            } else {
                sent.edit(ErrorEmbed('Uh oh! It seems like a shark ate the ethernet cable! I was unable to reach that site! `' + error.message + '`'))
            }

            logger.error(`SS Error (${url}): ${error.message}`)
        })
 
    },

    config: {
        command: "screenshot",
        aliases: ["sswebsite", "screenshotwebsite", "website", "ss"],
        description: "Screenshots a website",
        permissions: [],
        usage: `screenshot <url>`,
        cooldown: {
            time: 60000,
            premiumBypassable: true
        }
    }
}