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

        this.start = Date.now();
    }

    /**
     * 
     * @param {track} track 
     */
    addToQueue(track) {
        this.tracks.push(track);
    }

    getNextSong() {
        const song = this.tracks.shift();
        this.np = song;
        return song;
    }

    progressBar() {
        const percentDone = Math.round(convertRange(Math.round(((Date.now() - this.start) / (this.np.lengthMS)) * 100), [0, 100], [0, 10]))

        let bar = '';

        if(percentDone > 1) {

            for(let i of Array(percentDone - 1).keys()) bar += `▬`
            bar += '🔘'
            for(let i of Array(10 - percentDone).keys()) bar += `▬`

        } else 
            bar = `🔘▬▬▬▬▬▬▬▬▬▬`
    
        return bar;
    }

    startSong() {
        this.start = Date.now();
    }
}

function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}