const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: [true, "please enter your password"]

    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-avatar-icon-png-image_313572.jpg"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("Users", userSchema)