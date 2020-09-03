const Discord = require("discord.js")
const { utils, logger, audioPlayers } = require("../../../globals");
const AudioPlayer = require('../../../utils/AudioPlayer');
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ytlist = require('youtube-playlist')

var search = require('youtube-search');

const opts = {
    maxResults: 1,
    key: 'AIzaSyAHet6xGRuEfMAtaDty_Px0DqZ7PQA9hrQ'
};

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {

        if(!message.member.voice.channelID) return message.channel.send(ErrorEmbed("You must be in a Voice Channel to do this!"))
        if(!args[0]) return message.channel.send(ErrorEmbed("Incorrect Usage. `play <keyword/url>`"));

        if(args[0].match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/g)) {

            const sent = await message.channel.send(ErrorEmbed("🔃 Adding Songs\nThis could take a bit").setTitle(""))

            ytlist(args[0], ['id', 'name', 'url']).then(async res => {
                const videos = res.data.playlist

                /** @type {AudioPlayer} */
                var player;

                if(audioPlayers.has(message.member.voice.channel.id)) {
                    player = audioPlayers.get(message.member.voice.channel.id)

                } else {
                    player = new AudioPlayer(message.member.voice.channel, message.channel, videos[0].id, () => {
                        audioPlayers.delete(message.member.voice.channel.id)
                        message.channel.send(InfoEmbed("❌ Music Ended", "I've played the last song, cya later!"))
                    })
    
                    audioPlayers.set(message.member.voice.channel.id, player)
                }

                // videos.slice(1).forEach(video => {
                //     player.addSong(`https://youtube.com/watch?v=${video.id}`)
                // });
                
                await new Promise(async r => {
                    let i = 1;
                    const interv = setInterval(async () => {
                        if(i + 1 == videos.length) {
                            r();
                            clearInterval(interv);
                        } else {
                            player.addSong(`https://youtube.com/watch?v=${videos[i].id}`);
                            i++;
                        }
                    }, 500)
                })

                var desc = `I have added the following songs: ${utils.cutStringButAtNewLineUnderCharacterLimit(videos.map(video => `\n[${video.name}](https://youtube.com/watch?v=${video.id})`).join(''), 2048)[0]}`

                if (desc.length > 2048) {
                    desc = desc.substr(0, 2000) + '\n**And more...**'
                }
 
                sent.edit(InfoEmbed("📜 Playlist Added", desc))
            })

        } else if(args[0].match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/g)) {
            if(audioPlayers.has(message.member.voice.channel.id)) {
                audioPlayers.get(message.member.voice.channel.id).addSong(args[0])
                message.channel.send(InfoEmbed("🎧 Song Added", "That song has been added to the queue."))
            } else {
                const player = new AudioPlayer(message.member.voice.channel, message.channel, args[0], () => {
                    audioPlayers.delete(message.member.voice.channel.id)
                    message.channel.send(InfoEmbed("❌ Music Ended", "I've played the last song, cya later!"))
                })

                audioPlayers.set(message.member.voice.channel.id, player)
            }
        } else {
            const edit = await message.channel.send(ErrorEmbed("🔍 Searching for " + args.join(" ")).setTitle(""));
            search(args.join(" "), opts, async (err, res) => {
                if(err) {
                    logger.error("Error looking up " + args.join(" ") + "\n" + err);
                    message.channel.send(ErrorEmbed("An internal error occured! This error has been logged."))
                    return;
                }

                if(res.length == 0 ) {
                    message.channel.send(ErrorEmbed("❌ No results found!").setTitle(""))
                } else {
                    const song = res[0]

                    if(audioPlayers.has(message.member.voice.channel.id)) {
                        audioPlayers.get(message.member.voice.channel.id).addSong(song.link)
                        message.channel.send(InfoEmbed(`🎵 Added to queue!`, `${song.title} has been added!`).setThumbnail(song.thumbnails.high.url))
                    } else {
                        const player = new AudioPlayer(message.member.voice.channel, message.channel, song.link, () => {
                            audioPlayers.delete(message.member.voice.channel.id)
                            message.channel.send(InfoEmbed("❌ Music Ended", "I've played the last song, cya later!"))
                        })
        
                        audioPlayers.set(message.member.voice.channel.id, player)
                        message.channel.send(InfoEmbed(`🎵 Added to queue!`, `${song.title} has been added!`).setThumbnail(song.thumbnails.high.url))
                    }
                }
            })
        }
    },

    config: {
        command: "play",
        aliases: ["music", "search"],
        description: "Play a song",
        permissions: [],
        usage: `play <url/keyword>`
    }
}