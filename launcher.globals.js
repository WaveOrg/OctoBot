const Log = require("./utils/logger");

/**
 * Logger
 */
module.exports.logger = new Log(true, './weblogs')

/**
 * 
 * @type {import("discord.js").ShardingManager}
 */
module.exports.shardingManager = null;