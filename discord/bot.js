const Discord = require("discord.js");

const { token } = require("../config.json");
const { client } = require("../globals");

client.commands = new Discord.Collection();

require("./handlers/events")(client);
require("./handlers/commands")(client);

client.login(token);