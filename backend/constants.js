const fs = require("fs").promises
const { backend } = require("../config.json")

module.exports = {

    discordBaseUrl: "https://discord.com/api/v8",

    ssl: {
        cert: fs.readFile(backend.ssl.certificate).catch(() => null),
        key: fs.readFile(backend.ssl.privateKey).catch(() => null)
    }

}