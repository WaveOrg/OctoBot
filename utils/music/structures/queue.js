const track = require('./track')
const { Player } = require('lavacord')
const { EventEmitter } = require('events');

module.exports = class Queue extends EventEmitter {
    /**
     * 
     * @param {string} guildID 
     * @param {track[]?} initialTracks
     * @param {Player} player
     */
    constructor(guildID, channel, voiceChannel, initialTracks, player) {
        super();

        this.guildID = guildID;
        this.channel = channel;
        this.voiceChannel = voiceChannel;

        this.tracks = initialTracks || [];
        this.player = player;
    }

    /**
     * 
     * @param {track} track 
     */
    addToQueue(track) {
        this.tracks.push(track);
    }

    getNextSong() {
        return this.tracks.shift()
    }
}