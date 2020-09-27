const Discord = require("discord.js")
const { logger } = require("../../../globals");
const utils = require("../../../utils/utils")
const fetch = require('node-fetch');

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?sources=reuters&pageSize=1&apiKey=8390ebe845f74fb1b97e40cdeec42047`
        );
        const json = await response.json();
        const articleArr = json.articles;
        let processArticle = article => {
            const embed = new Discord.MessageEmbed()
                .setColor('#FF4F00')
                .setTitle(article.title)
                .setURL(article.url)
                .setAuthor(article.author)
                .setDescription(article.description)
                .setThumbnail(article.urlToImage)
                .setTimestamp(article.publishedAt)
            return embed;
        };
        async function processArray(array) {
            for (const article of array) {
                const msg = await processArticle(article);
                message.channel.send(msg);
            }
        }
        await processArray(articleArr);

 
    


    },

    config: {
    command: "news",
        aliases: [],
            description: "Check the latest news in the world",
                permissions: [],
                    usage: `news`,
    }
}