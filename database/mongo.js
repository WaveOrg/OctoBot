const Mongoose = require('mongoose');
const chalk = require("chalk");
const util = require("../utils/utils");
const { mongo } = require("../config.json");

<<<<<<< HEAD
module.exports.start = () => Mongoose.connect(`mongodb${mongo.srvMode ? '+srv' : ''}://${mongo.user}:${mongo.password}@${mongo.host}${mongo.srvMode ? "" : ":" + mongo.port}/${mongo.database}`, {
=======
module.exports.start = () => Mongoose.connect(`mongodb${mongo.plusSRV ? '+srv' : ''}://${mongo.user}:${mongo.password}@${mongo.host}${mongo.port != 27017 ? `:${mongo.port}` : ''}/${mongo.database}`, {
>>>>>>> 8edb61bdae29ae2a26f4b39d1d0f566c5bc5b553
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(async () => {
        const { logger, client } = require("../globals");
        logger.logDiscord(client, `Connected to MongoDB at ${chalk.green(mongo.host)} (${chalk.gray(mongo.plusSRV ? 'srv domain' : await util.resolveDomain(mongo.host))}). Using database ${chalk.green(mongo.database)}.`)
    }).catch(console.error);