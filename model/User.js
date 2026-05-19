const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", user_schema);

module.exports = User;