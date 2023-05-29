import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentAction'
import Icons from '../Icons'
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

const InputComment = ({ children, post, onReply, setOnReply }) => {
    const [content, setContent] = useState('')

    const { auth, socket, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false);
            return;
        }

        setContent('')

        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,//reply: mongoose.Types.ObjectId,
            tag: onReply && onReply.user// tag: Object,
        }

        dispatch(createComment({ post, newComment, auth, socket }))

        if (setOnReply) return setOnReply(false);
    }

    return (

        <form className="comment_input" onSubmit={handleSubmit}>
            {children}

            <input type="text" placeholder="Bình luận..."
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    color: theme ? 'white' : '#111',
                    background: theme ? 'rgba(0,0,0,.03)' : '',
                }}
            />

            <Icons setContent={setContent} content={content} theme={theme} />

            {/* <button type="submit" className="postBtn">
                Đăng
            </button> */}
            <IconButton color='primary' type='submit' disabled={!content}>
                <SendIcon sx={{ fontSize: 25 }} />
            </IconButton>
        </form>
    )
}

export default InputComment
