const Log = require("./utils/logger");
const { client, player } = require("./discord/bot")

/**
 * Logger
 */
module.exports.logger = new Log(true);

/**
 * Common imports
 */
module.exports.utils = require("./utils/utils");

/**
 * Discord related
 */
module.exports.client = client;

/**
 * Music Related
 */
module.exports.player = player;