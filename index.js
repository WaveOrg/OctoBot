const mongoConnection = require("./database/mongo")
mongoConnection.then(() => {
    console.log("Mongo connected, starting Discord")
    require('./discord/bot')
})