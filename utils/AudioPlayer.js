const Discord = require('discord.js')
const { logger, client, utils } = require("../globals")

const ytdl = require('ytdl-core');
const { InfoEmbed } = require('./utils');

const streams = require('stream');

module.exports = class AudioPlayer {
    
    /**
     * 
     * @param {Discord.VoiceChannel} voiceChannel 
     * @param {Discord.TextChannel} textChannel 
     * @param {string} startingSongURL
     */
    constructor(voiceChannel, textChannel, startingSongURL, onEnd) {
        this.vc = voiceChannel;
        this.channel = textChannel;
        this.enabled = false;
        this.onEnd = onEnd;
        this.filters = '';

        (async () => this.currentSongDetails = await ytdl.getInfo(startingSongURL))();

        this.queue = [{data: this.currentSongDetails, url: startingSongURL}];

        this.stream = new streams.Transform()
        this.stream._transform = (chunk, encoding, done) => {
            this.stream.push(chunk);
            done();
        }

        const perms = voiceChannel.permissionsFor(client.user.id);

        if(!perms.has("SPEAK")) 
            return textChannel.send(utils.ErrorEmbed("I do not have permission to Speak in that channel!"))
        if(!perms.has("CONNECT"))
            return textChannel.send(utils.ErrorEmbed("I do not have permission to Connect in that channel!"))

        voiceChannel.join().then(voiceConnection => {
            this.voiceconn = voiceConnection;
            voiceConnection.play(this.stream)
            this.enabled = true;

            this.start();
        }).catch((err) => {
            logger.error(`Unable to join ${voiceChannel.id}\n${err}`)
            textChannel.send(utils.ErrorEmbed("An unexpected error occured when trying to join that channel. This error has been logged."))
        });
    }

    /**
     * 
     * @param {string} song 
     */
    async play(song) {
        if(this.enabled) {
            ytdl(song, {
                filter: 'audioonly',
                opusEnabled: true,
                encoderArgs: this.filters
            }).pipe(this.stream)

            this.currentSongDetails = await ytdl.getInfo(song);
            this.channel.send(InfoEmbed("▶ Music Started", `Currently Playing: \`${this.currentSongDetails.videoDetails.title}\``))

            this.started = Date.now();
        }
    }

    start() {
        if(this.enabled) {
            if(this.queue.length > 0) {
                const { url: song } = this.queue.shift()
                this.play(song)

                this.stream.on('end', () => {

                    this.stream = new streams.Transform()
                    this.stream._transform = (chunk, encoding, done) => {
                        this.stream.push(chunk);
                        done();
                    }

                    this.voiceconn.play(this.stream)
                    this.start()
                })
            } else {
                this.voiceconn.disconnect();
                this.onEnd();
            }
        }
    }

    async addSong(url) {
        if(this.enabled) {
            this.queue.push({url: url, data: await ytdl.getBasicInfo(url)});
        }
    }

    getCurrentDetails() {
        return this.currentSongDetails;
    }

    getQueue() {
        return this.queue;
    }

    getPos() {
        return this.started
    }

    skip() {
        if(this.enabled) {
            this.start();
        }
    }

    /**
     * 
     * @param {number} volume 
     */
    setVolume(volume) { this.voiceconn.dispatcher.setVolume(volume) }

    getCurrentVolume() { return this.voiceconn.dispatcher.volume * 100 }

    clearQueue() { this.queue = []; }

    pause() { 
        if(this.voiceconn.dispatcher.paused) this.voiceconn.dispatcher.resume()
        else this.voiceconn.dispatcher.pause()

        return this.voiceconn.dispatcher.paused
    }

    /**
     * 
     * @param {number} number 
     */
    bassBoost(number) {
        this.filters = 'bass=g=' + number +',dynaudnorm=f=200'
    }
}