const Mongoose = require("mongoose");

const userDataSchema = new Mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    premium: {
        type: Boolean,
        required: true,
        default: false
    },
    rankCard: { // Image in Base64
        type: String,
        required: true,
        default: ""
    },

})

module.exports = Mongoose.model("userData", userDataSchema);