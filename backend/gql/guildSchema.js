const { buildSchema } = require("graphql")
const { guildOptionsOf } = require("../../utils/dbUtils")
const GuildOptions = require("../../database/models/GuildOptions")
let { shardingManager } = require("../../launcher.globals")

module.exports.schema = buildSchema(`
type Query {
    guild(id: String): Guild
    guilds: [Guild]
}

type Mutation {
    setGuildPrefix(guildId: String, prefix: String): String
    enableModule(guildId: String, module: String): Boolean
    disableModule(guildId: String, module: String): Boolean
    toggleModule(guildId: String, module: String): Boolean
    setMessageChannelId(guildId: String, type: GuildMessageType, id: String): String
    setMessageDataType(guildId: String, type: GuildMessageType, dataType: String): String
    setMessageData(guildId: String, type: GuildMessageType, data: String): String
}

enum GuildMessageType {
    welcome,
    leave
}

enum GuildMessageDataType {
    text,
    embed,
    image
}

type Guild {
    id: String
    prefix: String
    activeModules: [String]
    messages(type: String): GuildMessages
    discordInfo: DiscordGuildInfo
}

type DiscordGuildInfo {
    name: String,
    iconURL: String
}

type GuildMessages {
    channelId: String,
    dataType: String,
    data: String
}
`)

module.exports.root = {
    guild: async ({ id }) => {
        const guildOptions = guildOptionsOf(id);
        const databaseResponse = await guildOptions.getFromDatabase()
        return await parseGuild(databaseResponse)
    },
    guilds: async () => {
        const all = await GuildOptions.find({})
        
        const guilds = []
        for(let databaseResponse of all) guilds.push(await parseGuild(databaseResponse))
        
        return guilds;
    },

    async setGuildPrefix({ guildId, prefix }) {
        await guildOptionsOf(guildId).setPrefix(prefix)
        return prefix;
    },

    async enableModule({ guildId, module }) {
        await guildOptionsOf(guildId).enableModule(module)
        return true;
    },

    async disableModule({ guildId, module }) {
        await guildOptionsOf(guildId).disableModule(module)
        return true;
    },

    async toggleModule({ guildId, module }) {
        await guildOptionsOf(guildId).toggleModule(module)
        return true;
    },

    async setMessageChannelId({ guildId, type, id }) {
        const guildOptions = guildOptionsOf(guildId);
        
        let messageContainer = null;
            
        switch(type) {
            case "welcome":
                messageContainer = await guildOptions.getWelcomeMessage();
                break;
            case "leave":
                messageContainer = await guildOptions.getLeaveMessage();
                break;
        }

        await messageContainer.setChannelId(id)
        return id;
    },

    async setMessageDataType({ guildId, type, dataType }) {
        const guildOptions = guildOptionsOf(guildId);
        
        let messageContainer = null;
            
        switch(type) {
            case "welcome":
                messageContainer = await guildOptions.getWelcomeMessage();
                break;
            case "leave":
                messageContainer = await guildOptions.getLeaveMessage();
                break;
        }

        await messageContainer.setDataType(dataType)
        return channelId;
    },

    async setMessageData({ guildId, type, data }) {
        const guildOptions = guildOptionsOf(guildId);
        
        let messageContainer = null;
            
        switch(type) {
            case "welcome":
                messageContainer = await guildOptions.getWelcomeMessage();
                break;
            case "leave":
                messageContainer = await guildOptions.getLeaveMessage();
                break;
        }

        await messageContainer.setData(data)
        return channelId;
    }
}

async function parseGuild(databaseResponse) {
    const guildOptions = guildOptionsOf(databaseResponse.guildId)
    const shardingManager = require("../../launcher.globals").shardingManager;
    const discordInfo = (await shardingManager.broadcastEval(`this.guilds.resolve("${databaseResponse.guildId}")`)).filter(it => !!it)[0];
    return {
        id: databaseResponse.guildId,
        prefix: databaseResponse.prefix,
        activeModules: databaseResponse.activeModules,
        messages: async ({ type }) => {
            let messageContainer = null;
            
            switch(type) {
                case "welcome":
                    messageContainer = await guildOptions.getWelcomeMessage();
                    break;
                case "leave":
                    messageContainer = await guildOptions.getLeaveMessage();
                    break;
            }

            return {
                channelId: messageContainer.getChannelId(),
                dataType: messageContainer.getDataType(),
                data: messageContainer.getData()
            }
        },
        discordInfo,
    }
}