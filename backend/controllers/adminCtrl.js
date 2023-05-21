// const Users = require('../models/userModel')
const Posts = require('../models/postModel')
const Report = require('../models/reportModel')
const Comments = require('../models/commentModel')
const adminCtrl = {
    //lấy các bài báo cáo ở database
    getReports: async (req, res) => {
        try {
            const reports = await Report.find().populate('post').populate('user reporter')

            res.json({
                // msg: 'Success!',
                result: reports.length,
                reports
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //xóa theo id bài Posts
    // deleteReport: async (req, res) => {
    //     try {
    //         const post = await Posts.findOneAndDelete({ _id: req.params.id })
    //         if (!post) {
    //             return res.status(404).json({ msg: 'Post not found' });
    //         }
    //         await Comments.deleteMany({ _id: { $in: post.comments } })
    //         await Report.deleteMany({ post: req.params.id })

    //         res.json({
    //             msg: 'Xóa bài viết thành công!'
    //         })
    //     }
    //     catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // },

    // deleteReport: async (req, res) => {
    //     try {
    //         const report = await Report.findOneAndDelete({ _id: req.params.id });
    //         if (!report) {
    //             return res.status(404).json({ msg: 'Report not found' });
    //         }
    //         // Find other reports associated with the same post
    //         const otherReports = await Report.find({ post: report.post });

    //         // Delete the associated post only if there are no other reports
    //         if (otherReports.length === 0) {
    //             await Posts.findOneAndDelete({ _id: report.post });
    //             await Comments.deleteMany({ post: report.post });
    //         }

    //         res.json({
    //             msg: 'Xóa báo cáo, bài viết và bình luận thành công!'
    //         });
    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message });
    //     }
    // },
    deleteReport: async (req, res) => {
        try {
            const report = await Report.findOneAndDelete({ _id: req.params.id });
            if (!report) {
                return res.status(404).json({ msg: 'Report not found' });
            }

            await Report.deleteMany({ post: report.post });
            await Posts.findOneAndDelete({ _id: report.post });
            await Comments.deleteMany({ post: report.post });

            res.json({
                msg: 'Xóa báo cáo, bài viết và bình luận thành công!'
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    deleteReportOnly: async (req, res) => {
        try {
            const report = await Report.findOneAndDelete({ _id: req.params.id });
            if (!report) {
                return res.status(404).json({ msg: 'Report not found' });
            }

            await Report.deleteMany({ post: report.post });

            res.json({
                msg: 'Xóa báo cáo thành công!'
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}
module.exports = adminCtrl
