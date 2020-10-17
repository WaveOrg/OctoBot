const Discord = require("discord.js");
const { utils, logger, player } = require("../../../globals");
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ytlist = require('youtube-playlist');
const moment = require("moment");

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
        if(!args[0]) return message.channel.send(ErrorEmbed("Incorrect Usage. `search <keyword>`"));

        const keyword = args.join(" ");
        const tracks = await player.search("ytsearch", keyword, message.author);
        if(tracks.length <= 0) return message.channel.send(ErrorEmbed("Couldn't find any songs."));
        
        const embed = InfoEmbed(`Searchin for ***${keyword}***`, "")
        for(let i = 0; i < Math.min(tracks.length, 5); i++) {
            embed.description += `${i + 1}. [${tracks[i].title}](${tracks[i].link}) - ${tracks[i].author} -> ${moment.duration(tracks[i].lengthMS).format('H:mm:ss')}\n` 
        }
        message.channel.send(embed);

        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000 })
            .then(async collected => {
                const msg = collected.first();
                const index = parseInt(msg);
                if(isNaN(index)) {
                    return message.channel.send(ErrorEmbed("That is not a number.")).then(msg => msg.delete({ timeout: 4000 }))
                }
                if(index < 1 || index > Math.min(tracks.length, 5)) return message.channel.send(ErrorEmbed("Number outside or range."));
                const track = tracks[index - 1]

                const wasPlayingBefore = player.isPlaying(message.guild.id)

                const queue = await player.play(track, message.member.voice.channel, message.channel, message.guild);

                message.channel.send(InfoEmbed("🎵 Added to queue!", `${track.title}`)
                    .addFields([
                        { name: "Duration", value: track.formattedLength, inline: true },
                        { name: "Author", value: track.author, inline: true },
                        { name: "Requested By", value: `<@${track.requestedBy.id}>`, inline: true }
                    ]));
                
                if(!wasPlayingBefore) {
                    queue.on('trackChange', song => {
                        message.channel.send(InfoEmbed("▶ Now Playing:", `${song.title}`)
                            .addFields([
                                { name: "Duration", value: song.formattedLength, inline: true },
                                { name: "Author", value: song.author, inline: true },
                                { name: "Requested By", value: `<@${song.requestedBy.id}>`, inline: true }
                            ]))
                    })
                }
            })

        /*if(!track) return message.channel.send(ErrorEmbed("I couldn't find a song by that name!"))

        const queue = await player.play(track, message.member.voice.channel, message.channel, message.guild);

        message.channel.send(InfoEmbed("🎵 Added to queue!", `${track.title}`)
            .addFields([
                { name: "Duration", value: track.formattedLength, inline: true },
                { name: "Author", value: track.author, inline: true },
                { name: "Requested By", value: `<@${track.requestedBy.id}>`, inline: true }
            ]));
        
        if(!wasPlayingBefore) {
            queue.on('trackChange', song => {
                message.channel.send(InfoEmbed("▶ Now Playing:", `${song.title}`)
                    .addFields([
                        { name: "Duration", value: song.formattedLength, inline: true },
                        { name: "Author", value: song.author, inline: true },
                        { name: "Requested By", value: `<@${song.requestedBy.id}>`, inline: true }
                    ]))
            })
        }*/
    },

    config: {
        command: "search",
        aliases: [],
        description: "Search for a song",
        permissions: [],
        usage: `search <keyword>`
    }
}