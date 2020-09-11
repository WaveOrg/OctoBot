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
        var sent = await message.channel.send(InfoEmbed("🔍 Finding a cool fact!", "Searching nearby islands for a dog!"))

        const redditData = await (await fetch(`https://uselessfacts.jsph.pl/random.json?language=en`)).json();

        if (!redditData.data || !redditData.data.children || redditData.data.children.length == 0) return message.channel.send(ErrorEmbed("I couldn't find any dogs right now! Try again later"))

        const post = redditData.data.children[Math.floor(Math.random() * redditData.data.children.length)].data;

        try {
            sent.edit(new Discord.MessageEmbed()
                .setTitle(post.title)
                .setImage(post.url)
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
        command: "fact",
        aliases: ["givemeinfo", "iamdumb"],
        description: "Learn something new!",
        permissions: [],
        usage: `fact`
    }
}