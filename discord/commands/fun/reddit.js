const Discord = require("discord.js")
const { utils, logger } = require("../../../globals");
const fetch = require('node-fetch');
const { ErrorEmbed } = require("../../../utils/utils");
module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if (!args[0]) return message.channel.send(ErrorEmbed("Usage: `reddit <subreddit>`"))

        const subreddit = args[0].toLowerCase();
        const redditData = await (await fetch(`https://www.reddit.com/r/${subreddit}/.json`)).json();

        if (redditData.data.children.length == 0) return message.channel.send(ErrorEmbed("Unable to find any posts from r/" + args[0]))

        const post = redditData.data.children[Math.floor(Math.random() * redditData.data.children.length)].data;

        message.channel.send(new Discord.MessageEmbed()
            .setTitle(post.title)
            .setImage(post.url)
            .setAuthor(`${post.ups} 👍 | ${post.downs} 👎`, "", `https://reddit.com${post.permalink}`)
            .setColor("fda52a")
            .setFooter(`From ${post.subreddit_name_prefixed}`)
            .setTimestamp(post.created_utc * 1000)
        )
    },

    config: {
        command: "reddit",
        aliases: [],
        description: "Browse reddit via a bot!",
        permissions: [],
        usage: `reddit <subreddit name (without the r/)>`
    }
}