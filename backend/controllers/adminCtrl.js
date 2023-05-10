const Users = require('../models/userModel')
const Posts = require('../models/postModel')
const Report = require('../models/reportModel')

const adminCtrl = {
    getReports: async (req, res) => {
        try {
            const reports = await Report.find().populate('post').populate('user')

            res.json({
                reports
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id })
            await Comments.deleteMany({ _id: { $in: post.comments } })
            await Report.deleteMany({ post: req.params.id })

            res.json({
                msg: 'Xóa bài viết thành công!'
            })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

}

module.exports = adminCtrl