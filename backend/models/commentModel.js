const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    //user này của thằng cmt bài viết
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    //id của bài viết
    postId: mongoose.Types.ObjectId,
    //id thằng chủ bài viết
    postUserId: mongoose.Types.ObjectId
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)