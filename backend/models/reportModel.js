// reportModel.js
const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Report', reportSchema)
