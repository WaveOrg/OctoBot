const Discord = require("discord.js");
const mongoConnection = require("../database/mongo")
const { token } = require("../config.json");
const Player = require("./music/structures/Player");
const { logger } = require("../launcher.globals")
//const { Player } = require("../utils/music/player");

loadStructureExtensions()
const client = new Discord.Client()

client.commands = new Discord.Collection();

// Doing this here because, well, ugh
module.exports = {
    client,
    player: new Player([{
        id:"1", host:"192.168.1.54", port: 2333, password:"sTE1GW25z9AXZgIyGhwpfDpUhl9TqVtPuPc9vWJUnZLebLp6rxWmZpXlWdJqFE0D"
    }], client)
    /*player: new Player(client, {
        leaveOnEnd: false,
        leaveOnEmpty: false
    })*/
}

module.exports.player.on("ready", (websockets) => {
    for(const websocket of websockets) logger.logLavalink(`Connected to node on ${websocket.url}`)
})

// Deleting globals from cache because js is weird
clearFromRequireCache("../globals")

mongoConnection.start().then(async () => {
    client.login(token);
})

require("./handlers/events")(client);
require("./handlers/commands")(client);

/**
 * @param {string} lib
 */
function clearFromRequireCache(lib) {
    delete require.cache[require.resolve(lib)]
}

function loadStructureExtensions() {
    require("../database/structures/Guild")
    require("../database/structures/User")
    require("../database/structures/Member")
}