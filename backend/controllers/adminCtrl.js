const Users = require('../models/userModel')
const Posts = require('../models/postModel')

const adminCtrl = {

    deletePost: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            await Comments.deleteMany({ _id: { $in: post.comments } })

            res.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: req.user
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = adminCtrl