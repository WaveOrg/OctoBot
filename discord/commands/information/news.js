const Discord = require("discord.js")
const { Menu: menu } = require('../../../utils/menu')
const fetch = require('node-fetch');
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const { logger } = require("../../../globals");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        const query = args.join(" ")

        const response = await (await fetch(`https://newsapi.org/v2/top-headlines?${query? `q=${encodeURIComponent(query)}&` : ''}pageSize=5&language=en`, {
            headers: {
                'X-Api-Key': '8390ebe845f74fb1b97e40cdeec42047'
            }
        })).json()

        if(response.status != 'ok') {
            return message.channel.send(ErrorEmbed("There was an error processing your request!"))
        }
        /** @type {Object[]} */
        const articleArr = response.articles;

        new menu(message.channel, message.author.id, 
            articleArr.map((article, index) => { 
                return {
                    name: index,
                    content: InfoEmbed(article.title || "No Title", article.description)
                        .setURL(article.url)
                        .setAuthor(article.author || "Unknown")
                        .setThumbnail(article.urlToImage)
                        .setTimestamp(article.publishedAt || message.createdTimestamp)
                        .setFooter("Use reactions to control where to go!"),
                    reactions: index == 0? {
                        "761393981984604211": "next",
                    } : index == articleArr.length - 1? {
                        "761393971733463090": "previous"
                    } : {
                        "761393971733463090": "previous",
                        "761393981984604211": "next",
                    },
                }
            })
        )
    },

    config: {
        command: "news",
        aliases: [],
        description: "Check the latest news in the world",
        permissions: [],
        usage: `news [search query]`,
    }
}