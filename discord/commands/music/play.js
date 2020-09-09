const Discord = require("discord.js");
const { utils, logger, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ytlist = require('youtube-playlist');

// const Youtube = require('youtube-query');
// const search = new Youtube('AIzaSyAHet6xGRuEfMAtaDty_Px0DqZ7PQA9hrQ');

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(!message.member.voice.channelID) return message.channel.send(ErrorEmbed("You must be in a Voice Channel to do this!"))
        const perms = message.member.voice.channel.permissionsFor(client.user)
        if(!perms.has("CONNECT")) return message.channel.send(ErrorEmbed("I cannot join the voice channel because I am missing the `Connect` permission."))
        if(!perms.has("SPEAK")) return message.channel.send(ErrorEmbed("I play music in the voice channel because I am missing the `Speak` permission."))
        if(!args[0]) return message.channel.send(ErrorEmbed("Incorrect Usage. `play <keyword/url>`"));

        const sent = await message.channel.send(new Discord.MessageEmbed().setDescription("🔍 Searching the waves for `" + (args.join(" ").length > 1000? args.join(" ").substr(0, 1000) : args.join(" ")) + '`').setTitle(" ").setColor("12cad6"))

        const track = await player.play(message.member.voice.channel, args.join(" "), message.member.user.tag);

        player.getQueue(message.guild.id).on('end', () => {
            message.channel.send(ErrorEmbed("<:no:750451799609311412> All songs have been played!").setTitle(""))
        }).on('trackChanged', (old, newt) => {
            message.channel.send(InfoEmbed("▶ Now Playing", `Now playing ${newt.name}`).setThumbnail(newt.thumbnail))
        })

        sent.edit(InfoEmbed(`🎵 Added to queue!`, `${track.name} has been added!`).setThumbnail(track.thumbnail))
    },

    config: {
        command: "play",
        aliases: ["music", "search"],
        description: "Play a song",
        permissions: [],
        usage: `play <url/keyword>`
    }
}