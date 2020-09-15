const Discord = require("discord.js");
const mongoConnection = require("../database/mongo")

const { token } = require("../config.json");
const { client } = require("../globals");

client.commands = new Discord.Collection();

require("./handlers/events")(client);
require("./handlers/commands")(client);

mongoConnection.then(async () => {
    client.login(token);
})
