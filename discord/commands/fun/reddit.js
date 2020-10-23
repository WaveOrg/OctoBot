const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const fetch = require('node-fetch');
const { ErrorEmbed, InfoEmbed } = require("../../../utils/utils");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        var sent = await message.channel.send(InfoEmbed("🔍 Finding a post!", "Waiting for the waves to bring me a reddit post."))

        if(!args[0]) return message.channel.send(ErrorEmbed("Usage: `reddit <subreddit name>`"))

        try {

            const subreddit = args[0].toLowerCase();
            const redditData = await (await fetch(`https://www.reddit.com/r/${subreddit}/.json?limit=50`)).json();
    
            if (!redditData.data || !redditData.data.children || redditData.data.children.length == 0) return message.channel.send(ErrorEmbed("Unable to find any posts from r/" + args[0]))

            const filteredData = redditData.data.children.filter(post => !post.data['over_18']);

            if(!filteredData || filteredData.length == 0) return message.channel.send(ErrorEmbed("Unable to find any non NSFW posts from r/" + args[0]))

            console.log(filteredData)

            const post = filteredData[Math.floor(Math.random() * filteredData.length)].data;

            console.log(post)

            sent.edit(new Discord.MessageEmbed()
                .setTitle(post.title)
                .setImage(post.url)
                .setAuthor(`${post.ups} 👍 | ${post.downs} 👎`, "", `https://reddit.com${post.permalink}`)
                .setColor("fda52a")
                .setFooter(`From ${post.subreddit_name_prefixed}`)
                .setTimestamp(post.created_utc * 1000)
            )
        } catch (error) {
            sent.edit(
                ErrorEmbed("Uh oh! I think a shark ate a cable, and caused an internal error. Please try your command again later. The shark has been reported to the life guards.")
            )

            logger.error(`Got error on ${message.content}\n${error}\nUSER: ${message.author.id}`)
        }
    },

    config: {
        command: "reddit",
        aliases: ["rslash", "r/"],
        description: "Browse reddit via a bot!",
        permissions: [],
        usage: `reddit <subreddit name (without the r/)>`
    }
}