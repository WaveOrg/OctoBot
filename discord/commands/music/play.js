const Discord = require("discord.js");
const { utils, logger, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ytlist = require('youtube-playlist');
const { modules } = require("../../../database/constants")

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
        if(!message.member.voice.channel.id) return message.channel.send(ErrorEmbed("You must be in a Voice Channel to do this!"))
        const perms = message.member.voice.channel.permissionsFor(client.user)
        if(!perms.has("CONNECT")) return message.channel.send(ErrorEmbed("I cannot join the voice channel because I am missing the `Connect` permission."))
        if(!perms.has("SPEAK")) return message.channel.send(ErrorEmbed("I play music in the voice channel because I am missing the `Speak` permission."))
        if(!args[0]) return message.channel.send(ErrorEmbed("Incorrect Usage. `play <keyword/url>`"));

        const type = player.detectType(args.join(" "))
        const tracks = await player.search(type, args.join(" "), message.author);
        const track = tracks.shift();
        
        if(!track) return message.channel.send(ErrorEmbed("I couldn't find a song by that name!"))

        const queue = await player.play(track, message.member.voice.channel, message.channel, message.guild);

        if(type === 'spotifyPlaylist') {
            tracks.forEach(t => queue.addToQueue(t));

            if(tracks.length === 0) {
                message.channel.send(InfoEmbed("🎵 Added to queue!", `${track.title}`)
                    .addFields([
                        { name: "Duration", value: track.formattedLength, inline: true },
                        { name: "Author", value: track.author, inline: true },
                        { name: "Requested By", value: `<@${track.requestedBy.id}>`, inline: true }
                    ]));
            } else {    
                message.channel.send(InfoEmbed("🎵 Songs added to queue!", `I've added ${tracks.length} songs to the queue.`))
            }
        } else {
            message.channel.send(InfoEmbed("🎵 Added to queue!", `${track.title}`)
                .addFields([
                    { name: "Duration", value: track.formattedLength, inline: true },
                    { name: "Author", value: track.author, inline: true },
                    { name: "Requested By", value: `<@${track.requestedBy.id}>`, inline: true }
                ]));
        }
        
    },

    config: {
        command: "play",
        aliases: ["music", "search"],
        description: "Play a song",
        permissions: [],
        usage: `play <url/keyword>`,
        requiresModules: [modules.MUSIC]
    }
}