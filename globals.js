const Log = require("./utils/logger");
const Discord = require('discord.js')
const Client = new Discord.Client()
const { Player } = require("./utils/music/player");

module.exports = {
    /**
     * Logger
     */
    logger: new Log(true),

    /**
     * Common imports
     */
    utils: require("./utils/utils"),

    /**
     * Discord related
     */
    client: Client,
    statcord: null,

    /**
     * Music Related
     */
    player: new Player(Client, {
        leaveOnEnd: false,
        leaveOnEmpty: false
    })
}