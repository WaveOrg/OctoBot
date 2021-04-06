const { Manager } = require('lavacord');
const discord = require('discord.js');
const { EventEmitter } = require('events');
const Queue = require('./Queue');
const fetch = require('node-fetch');
const Track = require('./Track');
const SpotifyURL = require('spotify-uri');
const { SpotifyParser } = require('spotilink');
const { InfoEmbed, ErrorEmbed } = require('../../../utils/utils');

/** @type {Object.<string, SpotifyParser>} */
const spotifyParsers = {};

module.exports = class Player extends EventEmitter {
    /**
     * 
     * @param {object[]} nodes 
     * @param {discord.Client} client 
     */
    constructor(nodes, client) {
        super();
        
        this.client = client;
        client.on('ready', () => {
            /** @type {Map<string, Queue>} */
            this.queues = new Map();

            this.manager = new Manager(nodes, {
                user: client.user.id,
                shards: client.shard.count,
                send: packet => {
                    const guild = client.guilds.resolve(packet.d.guild_id);
                    if(guild) return guild.shard.send(packet);
                }
            });

            client.ws
                .on('VOICE_SERVER_UPDATE',  a => this.manager.voiceServerUpdate(a) ) 
                .on('VOICE_STATE_UPDATE', a => this.manager.voiceStateUpdate(a) )
                .on('GUILD_CREATE', async data => {
                    for(const state of data.voice_states)
                        await this.manager.voiceStateUpdate({ ...state, guild_id: data.id })
                })
            ;

            this.manager.connect().then(this.emit.bind(this, 'ready'))
        });
    }
    
    /**
     * 
     * @param {('ytsearch'|'ytlink'|'soundcloud'|'website'|'spotify'|'spotifyPlaylist')} source 
     * @param {String} searchTerms 
     * @param {discord.User} requestedBy
     * @returns {Promise<Track[]>}
     */
    async search(source, searchTerms, requestedBy) {
        const node = this.manager.idealNodes[0];

        if(source === 'spotify' || source === 'spotifyPlaylist') {
            /** @type {SpotifyParser} */
            var spotilink;

            if(spotifyParsers[node.id]) 
                spotilink = spotifyParsers[node.id]
            else 
                spotilink = spotifyParsers[node.id] = new SpotifyParser(node, '0e2cf77d57894505a2c05c045a409258', '89d05519e56f4b468534223df4f34d4e');

            if(!spotilink.token) { // using while freezes up entire bot
                await new Promise(done => {
                    const interval = setInterval(() => {
                        if(spotilink.token) {
                            clearInterval(interval);
                            done();
                        }
                    }, 10)
                });
            }

            if(source === 'spotifyPlaylist') {
                return (await spotilink.getPlaylistTracks(SpotifyURL.parse(searchTerms).id, true)).filter(track => track).map(track => new Track(track, requestedBy, source));
            } else {
                return [await spotilink.getTrack(SpotifyURL.parse(searchTerms).id, true)].map(track => new Track(track, requestedBy, source));
            }
        } else {
            const param = new URLSearchParams();
        
            if(source == 'ytsearch') param.append("identifier", `${source}:${searchTerms}`)
                else param.append("identifier", `${searchTerms}`)

            const tracks = await fetch(`http://${node.host}:${node.port}/loadtracks?${param}`, {
                headers: {
                    Authorization: node.password
                }
            }).then(res => res.json()).then(data => data.tracks).catch(err => err);

            return tracks.map(track => new Track(track, requestedBy, source));
        }
    }

    /**
     * 
     * @param {(Track|Track[])} track
     * @param {discord.VoiceChannel} voiceChannel
     * @param {discord.TextChannel} textChannel
     * @param {discord.Guild} guildID
     */
    async play(track, voiceChannel, textChannel, guild) {
        const guildID = guild.id
        if(this.queues.has(guildID)) {
            const queue = this.queues.get(guildID);
            if(Array.isArray(track)) track.forEach(theTrack => queue.addToQueue(theTrack))
            else queue.addToQueue(track)
        } else {
            const player = await this.manager.join({
                guild: guildID,
                channel: voiceChannel.id,
                node: this.manager.idealNodes[0].id
            }, {
                selfdeaf: true
            });

            player.on('end', change => {
                if(change.reason === "REPLACED") return; // ignore skip
                this._playTrack(guildID);
            });

            const queue = new Queue(guildID, textChannel, voiceChannel, Array.isArray(track) ? track : [track], player);

            queue.on('trackChange', song => {
                console.log(queue.loop, this.queues.has(guildID))
                if(queue.loop != 'current' && this.queues.has(guildID))
                    textChannel.send(InfoEmbed("▶ Now Playing:", `${song.title}`)
                        .addFields([
                            { name: "Duration", value: song.formattedLength, inline: true },
                            { name: "Author", value: song.author, inline: true },
                            { name: "Requested By", value: `<@${song.requestedBy.id}>`, inline: true }
                        ]))
            });

            queue.on('end', () => {
                textChannel.send(ErrorEmbed("<:no:750451799609311412> All songs have been played!"))
            }); 
            
            this.queues.set(guildID, queue);

            this._playTrack(guildID);
        }

        this._emitToListeners(guildID);
        return this.queues.get(guildID)
    }

    /**
     * 
     * @param {String} guildID
     */
    _playTrack(guildID) {
        this._emitToListeners(guildID);
        const queue = this.queues.get(guildID);
        const song = queue.getNextSong();

        if(!song) {
            this.manager.leave(guildID);
            this.queues.delete(guildID);
            return;
        }

        queue.startSong()
        queue.emit('trackChange', song);
        queue.player.play(song.lavalinkID);
    }

    /**
     * 
     * @param {String} input
     */
    detectType(input) {
        if(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(input))
            return 'ytlink';
        else if(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/.test(input))
            return 'soundcloud'
        else if(isSpotifyURL(input))
            return SpotifyURL.parse(input).type === 'track' ? 'spotify' : 'spotifyPlaylist' 
        else if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(input))
            return 'website';
        else 
            return 'ytsearch';
    }

    /**
     * 
     * @param {string} guildID 
     * @param {number} newVolume 
     */
    changeVolume(guildID, newVolume) {
        this.queues.get(guildID).player.volume(newVolume);
        this._emitToListeners(guildID);
    }

    /**
     * 
     * @param {('toggle'|boolean)} toggle
     * @param {String} guildID
     * @returns {Promise<Boolean>}
     */
    async setPause(toggle, guildID) {
        const queue = this.queues.get(guildID);

        if(toggle == "toggle") {
            const currentState = queue.player.paused;
            await queue.player.pause(!currentState);
        } else {
            await queue.player.pause(toggle);
        }

        this._emitToListeners(guildID);
        if(queue.player.paused) queue.lastPaused = Date.now();
        else {
            queue.start;
            queue.lastPaused = -1
        };
        return queue.player.paused;
    }        

    /**
     * 
     * @param {String} guildID 
     */
    isPlaying(guildID) {
        return this.queues.has(guildID);
    }

    /**
     * 
     * @param {String} guildID 
     */
    getQueue(guildID) {
        return this.queues.get(guildID)
    }

    /**
     * 
     * @param {String} guildID 
     */
    skip(guildID) {
        //this.queues.get(guildID).player.stop();
        this._playTrack(guildID)
    }

    /**
     * 
     * @param {String} guildID
     */
    stop(guildID) {
        return this.queues.get(guildID).player.stop()
    }

    async _emitToListeners(guildId) {
        this.client.shard.send({ _shardEvent: "emitMusicToListeners", guildId })
    }

}

function isSpotifyURL(string) {
    try {
        const asdf = SpotifyURL.parse(string);
        return asdf;
    } catch (error) {
        return false;
    }
}