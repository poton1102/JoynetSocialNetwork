import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import useTheme from '@mui/material/styles/useTheme';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../../utils/chatLogic";

let timer;

const ScrollableChat = React.forwardRef(({ messages, istyping, fetchMoreRef, hasMoreMessages }, ref) => {
    const [lastMessage, setLassMessage] = useState()

    const { auth } = useSelector(state => state);
    const user = auth.user;
    const { palette } = useTheme()

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages]);


    return (
        <>
            {hasMoreMessages && <div ref={fetchMoreRef}>Load more</div>}
            {messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id} ref={i === messages.length - 1 ? setLassMessage : null}>
                    {(isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)) && (
                            <Tooltip title={m.sender.username} placement="bottom-start" arrow>
                                <Avatar
                                    sx={{
                                        width: 24, height: 24, cursor: 'pointer', marginTop: '8px',
                                        marginRight: '9px',
                                    }}
                                    alt={m.sender.username}
                                    src={m.sender.avatar}
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? palette.primary.light : palette.primary.main
                                }`,
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
            <div ref={messagesEndRef} />
            {/* {istyping && <Typography component='p'>... is typing</Typography>} */}
        </>
    );
});

export default ScrollableChat;
