const mongoConnection = require("./database/mongo")
const { logger } = require("./globals")
mongoConnection.then(() => {
    logger.log("Mongo connected, starting Discord")
    require('./discord/bot')
})