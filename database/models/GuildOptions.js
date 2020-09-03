const { Schema, Model } = require('mongoose')
const { prefix } = require('../../config.json')

const guildOptionsSchema = new Schema({
    prefix: {
        type: String,
        required: true,
        default: prefix
    },
    activeModules: {
        type: Array,
        required: true,
        default: []
    }
}, { collection: "guildSettings" })

module.exports = new Model(guildOptionsSchema);
module.exports.modules = {
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