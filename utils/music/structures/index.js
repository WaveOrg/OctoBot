const { Manager } = require('lavacord');
const discord = require('discord.js');
const { EventEmitter } = require('events');
const Queue = require('./queue');
const fetch = require('node-fetch');
const Track = require('./track');

module.exports = class Player extends EventEmitter {
    /**
     * 
     * @param {object[]} nodes 
     * @param {discord.Client} client 
     */
    constructor(nodes, client) {
        super();
        
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
     * @param {('ytsearch')} source 
     * @param {String} searchTerms 
     * @param {discord.User} requestedBy
     * @returns {Promise<Track[]>}
     */
    async search(source, searchTerms, requestedBy) {
        const node = this.manager.idealNodes[0];

        const param = new URLSearchParams();
        param.append("identifier", `${source}:${searchTerms}`)

        const tracks = await fetch(`http://${node.host}:${node.port}/loadtracks?${param}`, {
            headers: {
                Authorization: node.password
            }
        }).then(res => res.json()).then(data => data.tracks).catch(err => err);

        return tracks.map(track => new Track(track, requestedBy, source));
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
            if(Array.isArray(track)) return track.forEach(theTrack => queue.addToQueue(theTrack))
        } else {
            const player = await this.manager.join({
                guild: guildID,
                channel: voiceChannel.id,
                node: this.manager.idealNodes[0].id
            }, {
                selfdeaf: true
            });

            player.volume(100);

            player.on('end', change => {
                if(change.reason === "REPLACED") return; // ignore skip
                this._playTrack(guildID);
            });

            const queue = new Queue(guildID, textChannel, voiceChannel, Array.isArray(track) ? track : [track], player);
            
            this.queues.set(guildID, queue);
        }

        this._playTrack(guildID);

        return this.queues.get(guildID)
    }

    /**
     * 
     * @param {String} guildID
     */
    _playTrack(guildID) {
        const queue = this.queues.get(guildID);
        const song = queue.getNextSong();
        
        if(!song) {
            queue.emit('end');
            this.manager.leave(guildID);
            this.queues.delete(guildID);
            return;
        }

        queue.emit('trackChange', song);
        queue.player.play(song.lavalinkID);
    }

    /**
     * 
     * @param {string} guildID 
     * @param {number} newVolume 
     */
    changeVolume(guildID, newVolume) {
        if(newVolume > 200 || newVolume < 0) return new Error("Volume out of range.");
        this.queues.get(guildID).player.volume(newVolume);
    }

    /**
     * 
     * @param {String} guildID 
     */
    isPlaying(guildID) {
        return this.queues.has(guildID);
    }

}