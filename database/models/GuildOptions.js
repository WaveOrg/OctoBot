const Mongoose = require('mongoose')
const { modules, welcomeLeaveTypes } = require("../constants")
const { prefix } = require('../../config.json')

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
        default: Object.values(modules)
    },
    autoRole: {
        type: new Mongoose.Schema({
            enabled: {
                type: Boolean,
                required: true,
            },
            roleId: {
                type: String,
                required: true
            }
        }),
        required: true,
        default: {
            enabled: false,
            roleId: "null"
        }
    },
    messages: {
        type: new Mongoose.Schema({
            welcome: {
                type: new Mongoose.Schema({
                    channelId: {
                        type: String,
                        required: true,
                    },
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
                    channelId: {
                        type: String,
                        required: true,
                    },
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
                channelId: "null",
                dataType: welcomeLeaveTypes.TEXT,
                data: "Welcome to %server%, %member%"
            },
            leave: {
                channelId: "null",
                dataType: welcomeLeaveTypes.TEXT,
                data: "Goodbye %member% from %server%"
            }
        }
    }
}, { collection: "guildSettings" })

module.exports = Mongoose.model("guildOptions", guildOptionsSchema);
module.exports.defaults = {
    guildId: "null",
    prefix: prefix,
    activeModules: Object.values(modules),
    autoRole: {
        enabled: false,
        roleId: "null"
    },
    messages: {
        welcome: {
            channelId: "null",
            dataType: welcomeLeaveTypes.TEXT,
            data: "Welcome to %server%, %member%"
        },
        leave: {
            channelId: "null",
            dataType: welcomeLeaveTypes.TEXT,
            data: "Goodbye %member% from %server%"
        }
    }
}