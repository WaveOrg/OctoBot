const globals = require("./globals");
const Statcord = require('statcord.js')
const { logger } = globals
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./discord/bot.js', 
    { 
        token: require('./config.json').token,
        totalShards: 'auto'
    }
);

manager.on('shardCreate', 
    shard => logger.log(`Launched shard ${shard.id}`));


logger.log("Spawining shards.")
manager.spawn().then(s => {
    logger.log(`Successfully spawned ${s.size} ${s.size > 1 ?  "shards" : "shard"}.`)
})

globals.statcord = new Statcord.ShardingClient({
    key: "statcord.com-t4ElyB0YOEUJuEX5iklN",
    manager,
    postCpuStatistics: true, /* Whether to post CPU statistics or not, defaults to true */
    postMemStatistics: true, /* Whether to post memory statistics or not, defaults to true */
    postNetworkStatistics: true, /* Whether to post network statistics or not, defaults to true */
})

globals.statcord.on("autopost-start", () => {
    logger.log("Started autopost");
});