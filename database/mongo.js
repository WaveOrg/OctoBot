const Mongoose = require('mongoose');
const chalk = require("chalk");
const util = require("../utils/utils");
const { mongo } = require("../config.json");

module.exports.start = () => Mongoose.connect(`mongodb://${mongo.user}:${mongo.password}@${mongo.host}${mongo.port != 27017 ? `:${mongo.port}` : ''}/${mongo.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(async () => {
        const { logger, client } = require("../globals");
        logger.logDiscord(client, `Connected to MongoDB at ${chalk.green(mongo.host)} (${chalk.gray(await util.resolveDomain(mongo.host))}). Using database ${chalk.green(mongo.database)}.`)
    }).catch(console.error);