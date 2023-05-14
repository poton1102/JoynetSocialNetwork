const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')
const Report = require('../models/reportModel')
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        //19 sản phẩm
        //3 trang mỗi trang 6 sản phẩm
        //skip=2*6=12
        const page = this.queryString.page * 1 || 1 //3 trang
        const limit = this.queryString.limit * 1 || 30//6
        const skip = (page - 1) * limit//2x6=12, skip(12)   
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
    createPost: async (req, res) => {
        try {
            const { content, images } = req.body



            // Kiểm tra trạng thái chặn đăng bài của người dùng
            const user = await Users.findById(req.user._id);
            if (user.isPostBlockedUntil && user.isPostBlockedUntil > new Date()) {
                // Ngăn chặn chủ bài viết đăng bài
                return res.status(403).json({ msg: 'You are temporarily blocked from posting.' });
            }

            if (images.length === 0)
                return res.status(400).json({ msg: "Hãy thêm ảnh." })

            const newPost = new Posts({
                content, images, user: req.user._id
            })
            await newPost.save()

            res.json({
                msg: 'Tạo post thành công!',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                user: [...req.user.following, req.user._id]
            }), req.query).paginating()

            const posts = await features.query.sort('-createdAt')
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updatePost: async (req, res) => {
        try {
            const { content, images } = req.body

            const post = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                content, images
            }).populate("user likes", "avatar username fullname")

                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                msg: "Update bài viết thành công!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    likePost: async (req, res) => {
        try {
            // It uses the Mongoose find method to search for the post by its _id 
            //and to check if the likes array includes the _id of the current user.
            //If a post is found, that means the user has already liked it, so the server will respond with an error message in JSON format.
            const post = await Posts.find({ _id: req.params.id, likes: req.user._id })
            if (post.length > 0) return res.status(400).json({ msg: "Bạn đã thích bài post." })

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user._id }
            }, { new: true })

            if (!like) return res.status(400).json({ msg: 'Post này không tồn tại.' })

            res.json({ msg: 'Liked Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unLikePost: async (req, res) => {
        try {

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user._id }
            }, { new: true })

            if (!like) return res.status(400).json({ msg: 'Post này không tồn tại.' })

            res.json({ msg: 'UnLiked Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query).paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            if (!post) return res.status(400).json({ msg: 'Post này không tồn tại.' })

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getPostsDicover: async (req, res) => {
        try {

            const newArr = [...req.user.following, req.user._id]

            const num = req.query.num || 100

            const posts = await Posts.aggregate([
                { $match: { user: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Thành công!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deletePost: async (req, res) => {
        try {

            const post = await Posts.findOne({ _id: req.params.id })
            if (!post) {
                return res.status(404).json({ msg: 'Không tìm thấy post' })
            }

            // Kiểm tra xem user có role "admin" hay không
            // if (req.user.role !== 'admin') {
            //     return res.status(403).json({ msg: 'Access denied' })
            // }

            await Comments.deleteMany({ _id: { $in: post.comments } })
            // await Report.deleteMany({ post: report.post });
            await Report.deleteMany({ post: post._id });
            await post.remove()

            res.json({
                msg: 'Xóa bài viết thành công!',
                newPost: {
                    ...post,
                    user: req.user
                }
            })

        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    savePost: async (req, res) => {
        try {
            //tìm id trong mảng saved, nếu nó trùng với id của thằng user._id thì sẽ trả về false, vì nó đã save post rồi
            const user = await Users.find({ _id: req.user._id, saved: req.params.id })
            if (user.length > 0) return res.status(400).json({ msg: "Đã lưu post." })

            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'Người dùng này không tồn tại.' })

            res.json({ msg: 'Đã lưu Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'Người dùng này không tồn tại.' })

            res.json({ msg: 'Bỏ lưu Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: { $in: req.user.saved }
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    // reportPost: async (req, res) => {
    //     try {
    //         const { postId, reason } = req.body
    //         const newReport = new Report({
    //             post: postId,
    //             user: req.user._id,
    //             reason
    //         });
    //         await newReport.save()

    //         res.json({
    //             msg: 'Báo cáo bài viết thành công!',
    //         })

    //     }
    //     catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // }


    reportPost: async (req, res) => {
        try {
            const { reportData } = req.body;
            // console.log({ postId })
            // // Kiểm tra xem bài viết có tồn tại không
            // const post = await Posts.findOne({ _id: postId });

            const post = await Posts.findOne({ _id: req.params.id })

            if (!post) {
                return res.status(404).json({ msg: 'Bài viết không tồn tại.' });
            }

            // if (!reason) {
            //     return res.status(400).json({ msg: "Vui lòng cung cấp lý do báo cáo." });
            // }
            // Tạo báo cáo mới
            const newReport = new Report({
                post: post,
                user: post.user,
                reason: reportData,
                reporter: req.user._id, // Thông tin người báo cáo
            });
            await newReport.save();


            res.json({
                msg: 'Báo cáo bài viết thành công!',
                newReport: {
                    ...newReport._doc,
                    reporter: req.user
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

}


module.exports = postCtrl