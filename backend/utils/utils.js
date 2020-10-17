const dns = require("dns").promises;
const fs = require("fs").promises;
const path = require("path")

/**
 * 
 * @returns {JSON} A bunch of utility functions
 */
module.exports = {

    /**
     * 
     * @param {Date} date
     * @param {Boolean} time
     * @returns  {String} Formatted Date
     */
    formatDate: function(date, time) {
        if(time) {
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();

            return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second}`;
        }

        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();

        if(dd < 10) dd = `0${dd}`
        if(mm < 10) mm = `0${mm}`

        return `${dd}-${mm}-${yyyy}`
    },

    /**
     * 
     * @param {String} rootPath 
     * @param {Function} cb 
     */
    scanFolderJs: async function(rootPath, cb) {
        await fs.readdir(rootPath).then(async files => {
            for(let file of files) {
                const stat = await fs.stat(`${rootPath}/${file}`)
                if(stat.isDirectory()) {
                    //return this.scanFolderJs(`${rootPath}/${file}`, cb);
                } else if(file.endsWith(".js")) {
                    cb(require(path.resolve(`${rootPath}/${file}`)));
                }
            }
        }).catch(err => {
            console.error(err)
        })
    },

    /**
     * 
     * @param {Object} data
     * @param  {...String} proprs
     * @returns {Boolean}
     */
    dataContains: function(data, ...props) {
        for(let prop of props) if(!data.hasOwnProperty(prop)) return false
        
        return true;
    },

    /**
     * 
     * @param {String} domain
     * @returns {String} IP address corresponding to the domain 
     */
    resolveDomain: async function(domain) {
        return (await dns.lookup(domain)).address
    }

}
