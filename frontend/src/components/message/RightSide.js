import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined'
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Popper,
    Skeleton,
    Stack,
    Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { getSenderFull } from '../../utils/chatLogic'
import { getDataAPI, postDataAPI } from '../../utils/fetchData'
import Icons from '../Icons'
import { SmallAvatar, StyledBadge } from '../StyleBadge'
import UserCardSkeleton from '../skeleton/UserCard'
import ScrollableChat from './ScrollableChat'
import UpdateGroupChat from './UpdateGroupChat'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'


const RightSide = () => {
    const { auth, message, theme, socket, online, peer } = useSelector(state => state)
    const dispatch = useDispatch()

    const [text, setText] = useState('')

    const [messages, setMessages] = useState([])
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [messagesLength, setMessagesLength] = useState(0)
    const [page, setPage] = useState(1)

    const [socketConnected, setSocketConnected] = useState(false);
    const [firstLoad, setFirstLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const [emojiRefEl, setEmojiRefEl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault()
        socket.emit("stop typing", message.selectedChat._id);
        try {
            const { data } = await postDataAPI(
                "message",
                {
                    content: text,
                    chatId: message.selectedChat,
                },
                auth.token
            );
            socket.emit("new message", data);
            setText('')
            setMessages([data, ...messages]);
            setMessagesLength(prevLength => prevLength + 1)
        } catch (error) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.msg } })
        }
    }

    const fetchMessages = async (firstLoad = false) => {
        if (!hasMoreMessages) return;
        if (loading) return;

        try {
            if (firstLoad) setFirstLoad(true);
            setLoading(true)
            console.log(page)
            const { data } = await getDataAPI(`message/${message.selectedChat._id}?page=${page}&limit=20`, auth.token)

            setMessages(prevMessages => {
                const newMessages = [...prevMessages, ...data.messages]
                if (data.messages.length === 0) setHasMoreMessages(false)
                setMessagesLength(newMessages.length)
                return newMessages
            });

            if (firstLoad) socket.emit("join chat", message.selectedChat._id);
        } catch (error) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.msg } })
        }
        setFirstLoad(false)
        setLoading(false);
    };

    const typingHandler = (e) => {
        setText(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", message.selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", message.selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    const fetchMoreRef = useIntersectionObserver(() => {
        if (loading) return;
        setPage(prevPage => prevPage + 1)
    });

    useEffect(() => {
        if (message.selectedChat) fetchMessages(true)

        return () => {
            console.log('clear')
            setPage(1)
            setMessages([])
            setMessagesLength(0)
            setHasMoreMessages(true)
        }
        // eslint-disable-next-line
    }, [message.selectedChat])

    useEffect(() => {
        if (page > 1) fetchMessages()
        // eslint-disable-next-line
    }, [page])


    useEffect(() => {
        socket.emit("setup", auth.user);

        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        socket.on("message recieved", (newMessageRecieved) => setMessages([newMessageRecieved, ...messages]));
        // eslint-disable-next-line
    }, [socket, messages]);

    return (
        <Stack sx={{ flex: 1 }}>
            <div className="message_header" style={{ cursor: 'pointer' }} >
                {firstLoad ?
                    <UserCardSkeleton primaryWidth='150px' secondaryWidth='100px' /> : <>
                        {!message.selectedChat.isGroupChat ?
                            <Stack ml={2} direction='row' spacing={2} alignItems='center'>
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant={online.includes(getSenderFull(auth.user, message.selectedChat.users).avatar) ? 'dot' : ''}
                                >
                                    <Avatar src={getSenderFull(auth.user, message.selectedChat.users).avatar} />
                                </StyledBadge>
                                <Typography component='span'>{getSenderFull(auth.user, message.selectedChat.users).username}</Typography>
                            </Stack>
                            :
                            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{ width: '100%', px: 2 }}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <SmallAvatar src={message.selectedChat.users[0].avatar} />
                                    }
                                >
                                    <Avatar src={message.selectedChat.users[1].avatar} />
                                </Badge>
                                <UpdateGroupChat />
                            </Stack>
                        }
                    </>
                }
            </div>

            <div className="chat_container">
                {
                    firstLoad ? <>
                        {Array.from({ length: 25 }).map((_, i) => (<Skeleton key={i} />))}
                    </> :
                        <ScrollableChat messages={messages} fetchMoreRef={fetchMoreRef} hasMoreMessages={hasMoreMessages} />
                }
            </div>

            <form className="chat_input" onSubmit={handleSubmit} >
                <input type="text" placeholder="Enter you message..."
                    value={text} onChange={typingHandler}
                    style={{
                        filter: theme ? 'invert(1)' : 'invert(0)',
                        background: theme ? '#040404' : '',
                        color: theme ? 'white' : ''
                    }} />

                <IconButton
                    color={Boolean(emojiRefEl) ? 'success' : 'default'}
                    sx={{ position: 'relative' }}
                    onClick={(e) => setEmojiRefEl(ele => ele ? null : e.currentTarget)}
                >
                    <SentimentVerySatisfiedOutlinedIcon />
                </IconButton>
                <Popper
                    open={Boolean(emojiRefEl)}
                    anchorEl={emojiRefEl}
                    placement='top-start'
                    sx={{ zIndex: 9999 }}
                >
                    <Icons setContent={setText} content={text} theme={theme} />
                </Popper>

                <button type="submit" className="material-icons"
                    disabled={text ? false : true}>
                    near_me
                </button>
            </form>
        </Stack>
    )
}

export default RightSide
