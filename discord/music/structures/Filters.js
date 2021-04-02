/**
 * @typedef {'nightcore'|'bassboost'|'tremolo'|'karaoke'|'bassboost'|'earrape'} Filters
 */

const Bands = require("./Bands");
const _ = require("lodash");

const types = ['nightcore', 'tremolo', 'karaoke', 'bassboost', 'earrape'];

module.exports = class LavaDSPFilters {
    /**
     * 
     * @param {WebSocket} ws 
     * @param {String} guildID 
     */
    constructor(ws, guildID) {
        this.guildID = guildID;
        this.ws = ws;
        /** @type {Object.<string, Object>} */
        this.activeFilters = {};
    }

    /**
     * 
     * @param {Filters} type 
     */
    toggle(type, opts = { }) {
        if(!types.includes(type)) return { success: false, err: 'Unknown filter' };

        if(typeof opts.force === 'undefined') {
            if(this.activeFilters[type]) {
                delete this.activeFilters[type];
                this._applyFilters()
                return { success: true, op: 'disabled' }
            }
    
            if((type === 'bassboost' && this.activeFilters['earrape']))
                return { success: false, err: "Cannot have earrape and bassboost" }
    
            if(type === 'earrape' && this.activeFilters['bassboost'])
                return { success: false, err: "Cannot have bassboost and earrape" }
    
            this.activeFilters[type] = { active: true, ...opts };
            this._applyFilters();
    
            return { success: true, op: 'enabled' }
        } else {
            if(opts.force === 1) {
                if((type === 'bassboost' && this.activeFilters['earrape']))
                    return { success: false, err: "Cannot have earrape and bassboost" }
        
                if(type === 'earrape' && this.activeFilters['bassboost'])
                    return { success: false, err: "Cannot have bassboost and earrape" }

                this.activeFilters[type] = { active: true, ...opts };
                this._applyFilters();
                return { success: true, op: 'enabled' }
            } else {
                delete this.activeFilters[type];
                this._applyFilters();
                return { success: true, op: 'disabled' }
            }
        }
    }

    _applyFilters() {
        var data = { };

        if(this.activeFilters['nightcore']) {
            const opts = this.activeFilters['nightcore'];

            data['timescale'] = {
                pitch: opts.pitch ?? 1.1,
                rate: opts.rate ?? 1.2,
                speed: opts.speed ?? 1.0 
            }
        }

        if(this.activeFilters['tremolo']) {
            const opts = this.activeFilters['tremolo'];

            data['tremolo'] = {
                depth: opts.depth ?? 0.7,
                frequency: opts.frequency ?? 4
            }
        }

        if(this.activeFilters['karaoke']) {
            const opts = this.activeFilters['karaoke'];

            data['karaoke'] = {
                level: opts.level ?? 1.0,
                monoLevel: opts.monoLevel ?? 1.0,
                filterBand: opts.filterBand ?? 220,
                filterWidth: opts.filterWidth ?? 100
            }
        }

        if(this.activeFilters['bassboost']) {
            const opts = this.activeFilters['bassboost'];

            data['equalizer'] = _adjustBands(Bands.bassboost, opts.gain).bands
        }

        if(this.activeFilters['earrape']) {
            data['equalizer'] = Bands.earrape.bands
        }

        // if(!data['equalizer']) {
        //     data.equalizer = Bands.reset.bands
        // }

        this._send(data);
    }

    /**
     * 
     * @param {Object} data 
     */
    _send(data) {
        this.ws.send(JSON.stringify({
            op: "filters",
            guildId: this.guildID,
            
            ...data
        }));
    }
}

/**
 * @param {Object} bands
 * @param {String} bands.name
 * @param {Array} bands.bands
 * 
 * @param {number} range 0-100
 */
 function _adjustBands(bands, range) {
    const adjusted = _.cloneDeep(bands)
    for(const band of adjusted.bands) {
        band.gain = (band.gain / 100) * range;
    }
    return adjusted;
}
