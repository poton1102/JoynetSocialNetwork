const mongoose = require('mongoose')

// const conversationSchema = new mongoose.Schema({
//     recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
//     text: String,
//     media: Array,
//     call: Object
// }, {
//     timestamps: true
// })

const conversationSchema = new mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
}, {
    timestamps: true
})

module.exports = mongoose.model('conversation', conversationSchema)