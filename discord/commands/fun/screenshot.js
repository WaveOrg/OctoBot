const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const { InfoEmbed, ErrorEmbed, RedEmbed } = require('../../../utils/utils')

const captureWebsite = require('capture-website');
const ms = require('ms')

const cooldowns = new Map();

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(cooldowns.get(message.author.id) > Date.now()) return message.channel.send(ErrorEmbed(`Please wait, this command is under cooldown! Please wait ${ms(cooldowns.get(message.author.id) - Date.now(), {long: true})}`).setFooter("Premium users can bypass the cooldown!"))

        if(!args[0]) {
            message.channel.send(ErrorEmbed(`Usage: \`${this.config.usage}\``));
            return;
        }

        cooldowns.set(message.author.id, Date.now() + 60000)

        var url = (args.join(" ").startsWith('https://') || args.join(" ").startsWith('http://'))? args.join(' ') : `https://${args.join("  ")}`
        
        const sent = await message.channel.send(RedEmbed('<a:loading:752246174550982728> Taking a picture', '').setFooter("This may take up to 60 seconds."))
    

        captureWebsite.buffer(url, {
            width: 640,
            height: 480,
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
        usage: `ss <url>`
    }
}