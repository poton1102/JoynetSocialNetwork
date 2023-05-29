const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    content: { type: String, trim: true },
    chat: { type: mongoose.Types.ObjectId, ref: 'conversation' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
}, {
    timestamps: true
})

module.exports = mongoose.model('message', messageSchema)