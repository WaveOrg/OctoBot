const Discord = require("discord.js")
const { utils, logger, audioPlayers } = require("../../../globals");
const AudioPlayer = require('../../../utils/AudioPlayer');
const { InfoEmbed, ErrorEmbed } = require("../../../utils/utils");
const ytdl = require('ytdl-core');
const { Menu } = require("../../../utils/menu");

module.exports = {
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Client} client 
     */
    async run(message, args, client) {
        if(message.member.voice.channelID) {
            if(audioPlayers.has(message.member.voice.channel.id)) {
                const songs = audioPlayers.get(message.member.voice.channel.id).getQueue()
    
                var desc = ''
    
                for(let song of songs)
                    desc += `[${song.data.videoDetails.title}](${song.url})\n`

                if(desc.length > 2048) {
                    const pages = utils.cutStringButAtNewLineUnderCharacterLimit(desc);

                    return new Menu(message.channel, message.author.id, pages.map((txt, index) => { 

                        const reactions = { }
                        if(index != 0) reactions["▶"] = "next"
                        if(index + 1 != pages.length) reactions["◀"] = "previous"

                        console.log(txt)
                        console.log(reactions)

                        return { 
                            name: `${index}`, 
                            content: InfoEmbed('📜 Queue Page '+index, txt),
                            reactions: reactions
                        } 
                    }))
                } 
    
                message.channel.send(InfoEmbed("🎧 Queue", `${desc == ''? "No songs avaliable!" : desc}`))
            } else {
                message.channel.send(ErrorEmbed("It's a little quiet there, play a song then use this command!"))
            }
        } else {
            message.channel.send(ErrorEmbed("You must be in a VC!"))
        }
    },

    config: {
        command: "queue",
        aliases: ["q"],
        description: "Show the songs next up in the queue.",
        permissions: [],
        usage: `{{PREFIX}}queue`
    }
}