const fs = require('fs');

module.exports = class Logger {
    /**
     * 
     * @param {Boolean} debug 
     * @param {String} location
     */
    constructor (debug, location) {
        this.debugEnabled = debug || false
        this.location = location || `${__dirname}/../logs`

        // process.on('uncaughtException', (error) => {
        //     this.error(error.stack? error.stack : `${error.name}: ${error.message}`)
        // });

        // process.on('unhandledRejection', (error) => {
        //     this.error("UnhandledRejection: " + error)
        // });

        process.on('beforeExit', code => {
            if(code != 0) {
                this.error("Unhandled error has caused an unexpected shutdown. Code: " + code)
            } else {
                this.log(`Shutting down. Code: ${code}`)
            }
        });
    }

    /**
     * 
     * @param {Date} date 
     * @returns String
     */
    getFormattedDate(date) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();

        if(dd < 10) dd = `0${dd}`
        if(mm < 10) mm = `0${mm}`

        return `${yyyy}-${mm}-${dd}`
    }

    /**
     * 
     * @param {Date} date 
     */
    getFormattedTime() {
        let date = new Date();

        let hh = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        let mm = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        let ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

        return `[${hh}:${mm}:${ss}]`
    }

    /**
     * 
     * @param {String} message 
     */
    async accessLog(message) {
        fs.appendFileSync(`${this.location}/${this.getFormattedDate(new Date())}.log`, this.getFormattedTime() + " [ACCESS] " + message + "\n");
    }

    /**
     * 
     * @param {String} message 
     */
    log(message) {
        process.stdout.write(Buffer.from(`\x1b[34m${this.getFormattedTime()}\x1b[32m [INFO]\x1b[0m ${message}\n`))
        fs.appendFileSync(`${this.location}/${this.getFormattedDate(new Date())}.log`, `${this.getFormattedTime()} [INFO] ${message}\n`)
    }

    /**
     * 
     * @param {String} message 
     */
    debug(message) {
        if(this.debugEnabled) {
            process.stdout.write(Buffer.from(`\x1b[34m${this.getFormattedTime()} \x1b[33m[DEBUG]\x1b[0m ${message}\n`))
        }
    }

    /**
     * @param {String} message
     */
    error(message) {
        process.stdout.write(
            Buffer.from(
                `\x1b[34m${this.getFormattedTime()} \x1b[31m[ERROR]---------------------------------\n` +
                `\x1b[34m${this.getFormattedTime()} \x1b[31m[ERROR] ${message.split('\n').join(`\n\x1b[34m${this.getFormattedTime()} \x1b[31m[ERROR] `)}\n` +
                `\x1b[34m${this.getFormattedTime()} \x1b[31m[ERROR]---------------------------------\n`
            )
        )
        fs.appendFileSync(`${this.location}/${this.getFormattedDate(new Date())}.log`, `${this.getFormattedTime()} [ERROR]---------------------------------\n${this.getFormattedTime()} [ERROR] ${message.split('\n').join(`\n${this.getFormattedTime()} [ERROR] `)}\n${this.getFormattedTime()} [ERROR]---------------------------------\n`);
        global.errors++;
    }

    test() {
        this.log("Info Message");
        this.error("Multi-line\nError Test");
        this.debug("Debug Message")
    }

    getLogLocation() {
        return `${this.location}/${this.getFormattedDate(new Date())}.log`
    }
}