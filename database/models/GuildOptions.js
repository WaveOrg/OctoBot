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