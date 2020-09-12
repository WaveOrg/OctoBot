const Mongoose = require("mongoose");

const guildLevelingSchema = new Mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        required: true,
        default: 0
    },
    level: {
        type: Number,
        required: true,
        default: 0
    }
}, { collection: "guildLeveling" })

module.exports = Mongoose.model("guildLeveling", guildLevelingSchema);