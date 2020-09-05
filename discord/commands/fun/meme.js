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
        var sent = await message.channel.send(InfoEmbed("🔍 Finding a meme!", "Please wait, sailing the seven seas.").setImage("https://img.derock.dev/BnquAk.gif"))

        const redditData = await (await fetch(`https://www.reddit.com/r/memes/.json`)).json();

        if (!redditData.data || !redditData.data.children || redditData.data.children.length == 0) return message.channel.send(ErrorEmbed("I couldn't find any memes right now! Try again later"))

        const post = redditData.data.children[Math.floor(Math.random() * redditData.data.children.length)].data;

        try {
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
                ErrorEmbed("Uh oh! Something went wrong when sending your reddit post, please try again later!")
            )
        }
    },

    config: {
        command: "meme",
        aliases: ["memes"],
        description: "Find some good memes! This is basically the reddit command with the subreddit memes.",
        permissions: [],
        usage: `meme`
    }
}