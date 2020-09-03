const Discord = require("discord.js")
const { utils, logger, audioPlayers } = require("../../../globals");
const AudioPlayer = require('../../../utils/AudioPlayer');
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");

var search = require('youtube-search');

const opts = {
    maxResults: 5,
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

        if(args[0].match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/g)) {
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
                    await edit.edit(InfoEmbed("Results for __" + args.join(" ") + "__:", res.map((aa, index) => `**${index + 1}** » [${decodeURIComponent(aa.title)}](${aa.link})\n`)))
                    edit.awaitReactions((r, u) => u.id == message.author.id && ['❌', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].slice(0, res.length + 1).includes(r.emoji.name), {max: 1}).then(async (rs, u) => {

                        const r = rs.first()

                        if(r.emoji.name == '❌') {
                            edit.edit(ErrorEmbed("❌ Cancelled").setTitle(""))
                            edit.reactions.removeAll()
                            return;
                        }

                        edit.delete()

                        try {
                            var num;

                            switch(r.emoji.name) {
                                case '1️⃣': num = 0; break;
                                case '2️⃣': num = 1; break;
                                case '3️⃣': num = 2; break;
                                case '4️⃣': num = 3; break;
                                case '5️⃣': num = 4; break;
                            }

                            const song = res[num]

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
                        } catch (error) {
                            
                        }
                    })

                    try {
                        await edit.react('1️⃣');
                        await edit.react('2️⃣');
                        await edit.react('3️⃣');
                        await edit.react('4️⃣');
                        await edit.react('5️⃣');
                        await edit.react('❌');
                    } catch (error) { }
                }
            })
        }
    },

    config: {
        command: "search",
        aliases: ["search"],
        description: "Search for 5 songs.",
        permissions: [],
        usage: `search <keyword>`
    }
}