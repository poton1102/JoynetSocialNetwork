import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment } from '../../../redux/actions/commentAction'


function CommentMenu({ post, comment, setOnEdit }) {
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleRemove = () => {
        if (post.user._id === auth.user._id || comment.user._id === auth.user._id) {
            dispatch(deleteComment({ post, auth, comment, socket }))
        }
    }

    const MenuItem = () => {
        return (
            <>
                <div className="dropdown-item" onClick={() => setOnEdit(true)} >
                    <span className="material-icons">create</span> Sửa
                </div>
                <div className="dropdown-item" onClick={handleRemove}>
                    <span className="material-icons">delete_outline</span> Xóa
                </div>
            </>
        )
    }

    return (
        <div className="menu">
            {
                //chủ post thì đc xóa tất cả các bình luận, và đc edit cmt của mình nhưng ko đc edit cmt của người khác cmt vào bài viết
                (post.user._id === auth.user._id || comment.user._id === auth.user._id) &&
                <div className="nav-item dropdown">
                    <span className="material-icons" id="moreLink" data-toggle="dropdown">
                        more_vert
                    </span>
                    <div className="dropdown-menu" aria-labelledby="moreLink">
                        {
                            post.user._id === auth.user._id
                                ? comment.user._id === auth.user._id
                                    ? MenuItem()
                                    : <div className="dropdown-item" onClick={handleRemove}>
                                        <span className="material-icons">delete_outline</span> Xóa
                                    </div>
                                : comment.user._id === auth.user._id && MenuItem()
                        }
                    </div>

                </div>
            }
        </div>
    );
}

export default CommentMenu;