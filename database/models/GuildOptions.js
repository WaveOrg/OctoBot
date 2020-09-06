const Mongoose = require('mongoose')
const { prefix } = require('../../config.json')

const modules = {
    MUSIC: "music",
    MODERATION: "mod",
    WELCOME_MESSAGES: "welcomeMessage",
    LEAVE_MESSAGES: "leaveMessage",
    USER_VERIFICATION: "userVerification",
    AUTO_RESPONDER: "autoRespond",
    AUTO_ROLE: "autoRole",
    TICKETS: "tickets",
    FUN: "fun",
    PERSISTENT_ROLES: "persistentRoles",
    CUSTOM_COMMANDS: "cc"
}

const welcomeLeaveTypes = {
    TEXT: "text",
    JSON_EMBED: "embed",
    IMAGE_BASE64: "image"
}

const guildOptionsSchema = new Mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true,
        default: prefix
    },
    activeModules: {
        type: Array,
        required: true,
        default: []
    },
    messages: {
        type: new Mongoose.Schema({
            welcome: {
                type: new Mongoose.Schema({
                    dataType: {
                        type: String,
                        required: true,
                        enum: Object.values(welcomeLeaveTypes)
                    },
                    data: {
                        type: String,
                        required: true
                    }
                }),
                required: true
            },
            leave: {
                type: new Mongoose.Schema({
                    dataType: {
                        type: String,
                        required: true,
                        enum: Object.values(welcomeLeaveTypes)
                    },
                    data: {
                        type: String,
                        required: true
                    }
                }),
                required: true
            }
        }),
        required: true,
        default: {
            welcome: {
                dataType: welcomeLeaveTypes.TEXT,
                data: "Welcome to %server%, %member%"
            },
            leave: {
                dataType: welcomeLeaveTypes.TEXT,
                data: "Goodbye %member% from %server%"
            }
        }
    }
}, { collection: "guildSettings" })

module.exports = Mongoose.model("guildOptions", guildOptionsSchema);

module.exports.modules = modules;
module.exports.welcomeLeaveTypes = welcomeLeaveTypes;