const Discord = require("discord.js");
const mongoConnection = require("../database/mongo")
const { token } = require("../config.json");
const { Player } = require("../utils/music/player");

loadStructureExtensions()
const client = new Discord.Client()

client.commands = new Discord.Collection();

// Doing this here because, well, ugh
module.exports = {
    client,
    player: new Player(client, {
        leaveOnEnd: false,
        leaveOnEmpty: false
    })
}

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