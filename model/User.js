const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    task: {

    }
})

const User = mongoose.model("User", user_schema);

module.exports = User;