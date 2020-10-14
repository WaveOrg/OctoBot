const fs = require("fs")

module.exports = {

    discordBaseUrl: "https://discord.com/api/v8",

    ssl: {
        cert: fs.readFileSync("./backend/ssl/fullchain.pem"),
        key: fs.readFileSync("./backend/ssl/privkey.pem")
    }

}