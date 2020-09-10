const Log = require("./utils/logger");
const Statcord = require("statcord.js");
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
    statcord: new Statcord.Client({
        key: "statcord.com-t4ElyB0YOEUJuEX5iklN",
        client: Client,
        postCpuStatistics: true, /* Whether to post CPU statistics or not, defaults to true */
        postMemStatistics: true, /* Whether to post memory statistics or not, defaults to true */
        postNetworkStatistics: true /* Whether to post network statistics or not, defaults to true */
    }),

    /**
     * Music Related
     */
    player: new Player(Client, {
        leaveOnEnd: false,
        leaveOnEmpty: false
    })
}