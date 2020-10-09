const { Permissions } = require('discord.js')
const { getAllGuilds } = require("../oAuth/requests");
const { shardingManager } = require("../../launcher.globals");

/**
 * 
 * @param {import("../core/SocketRequest")} req 
 * @param {Function} next
 */
module.exports = (req, next) => {
    if(!req.user) return req.respondBadRequest("Guild Checks are only accessible if used with a verified user");
    if(!req.payload.guildId) return req.respondBadRequest("Invalid request.")

    getAllGuilds(req.user.access_token, req.user.token_type).then(async guilds => {
        guilds = guilds.map(guild => {

            const isAdmin = new Permissions(parseInt(guild.permissions))
                .has("ADMINISTRATOR")

            return isAdmin ? guild : null;
        }).filter(f => !!f)

        const shards = new Map();
        guilds.forEach(guild => {
            const shardId = (guild.id >> 22) % shardingManager.shards.size;
            if(shards.has(shardId)) shards.get(shardId).push(guild);
            else shards.set(shardId, [guild])
        })
        
        let sharedGuilds = [];
        for(let [shardId, shardGuilds] of shards) {
            sharedGuilds.push(...(await shardingManager.shards.get(shardId).eval(`this.guilds.cache.filter(g => [${shardGuilds.map(g => `"${g.id}"`).join(", ")}].includes(g.id))`)))
        }

        const foundGuild = sharedGuilds.find(it => it.id === req.payload.guildId);
        if(!foundGuild) return req.respondForbidden("You can't manage this guild")
        req.guild = foundGuild;
        req.shardId = (foundGuild.id >> 22) % shardingManager.shards.size;
        next()
    }).catch(err => {
        console.log(err)
        req.respondBadRequest(err);
    })
}