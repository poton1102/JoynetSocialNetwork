import { GLOBALTYPES, EditData, DeleteData } from './globalTypes'
import { POST_TYPES } from './postAction'
import { postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'
// import { createNotify, removeNotify } from '../actions/notifyAction'


export const createComment = ({ post, newComment, auth, socket }) => async (dispatch) => {
    //khi tạo comment mới, sẽ thêm vào mảng comment trong bảng post
    const newPost = { ...post, comments: [...post.comments, newComment] }
    // console.log({ post, newPost })
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {
        //giờ mới thêm 1 trường comment mới trong bảng commnet
        const data = { ...newComment, postId: post._id, postUserId: post.user._id }
        const res = await postDataAPI('comment', data, auth.token)
        // console.log(res)
        //cập nhật giao diện
        const newData = { ...res.data.newComment, user: auth.user }
        const newPost = { ...post, comments: [...post.comments, newData] }
        dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

        // Socket
        socket.emit('createComment', newPost)

        // Notify
        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
            recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
            url: `/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const updateComment = ({ comment, post, content, auth }) => async (dispatch) => {
    //postModel tham chiếu đến comments field, khi mà có comment trong mảng đấy thay đổi thì nó sẽ update lại mảng nhưng vẫn giữ nguyên số lượng cmt
    //=>tạo lại mảng mới để dispatch
    const newComments = EditData(post.comments, comment._id, { ...comment, content })
    const newPost = { ...post, comments: newComments }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })
    try {
        patchDataAPI(`comment/${comment._id}`, { content }, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const likeComment = ({ comment, post, auth }) => async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] }

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = { ...post, comments: newComments }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {
        await patchDataAPI(`comment/${comment._id}/like`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const unLikeComment = ({ comment, post, auth }) => async (dispatch) => {

    const newComment = { ...comment, likes: DeleteData(comment.likes, auth.user._id) }

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = { ...post, comments: newComments }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {
        await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const deleteComment = ({ post, comment, auth, socket }) => async (dispatch) => {
    //tất cả các cmt reply cmt chính sẽ bị filter, kp thì chỉ là cmt rep sẽ bị lưu vào mảng deleteArray
    const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]
    console.log(deleteArr)
    //filter tách ra khỏi cmt 
    const newPost = {
        ...post,
        comments: post.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
    }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    socket.emit('deleteComment', newPost)
    try {
        deleteArr.forEach(item => {
            deleteDataAPI(`comment/${item._id}`, auth.token)

            const msg = {
                id: item._id,
                text: comment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
                recipients: comment.reply ? [comment.tag._id] : [post.user._id],
                url: `/post/${post._id}`,
            }

            dispatch(removeNotify({ msg, auth, socket }))
        })
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }

}

