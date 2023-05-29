import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import useTheme from '@mui/material/styles/useTheme';
import React from 'react';
import { useSelector } from "react-redux";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../../utils/chatLogic";
import moment from 'moment';

const ScrollableChat = React.forwardRef(({ messages, fetchMoreRef, hasMoreMessages }, ref) => {
    const { auth } = useSelector(state => state);
    const { palette } = useTheme()

    return (
        <>
            {messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id} ref={(i === messages.length - 1 && hasMoreMessages) ? fetchMoreRef : null}>
                    {(isSameSender(messages, m, i, auth.user._id) ||
                        isLastMessage(messages, i, auth.user._id)) && (
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
                    <Tooltip title={moment(m.createdAt).fromNow()} placement="bottom-start" arrow>
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === auth.user._id ? palette.primary.light : palette.primary.main
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, auth.user._id),
                                marginTop: isSameUser(messages, m, i, auth.user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                        </span>

                    </Tooltip>
                </div>
            ))}
        </>
    );
});

export default ScrollableChat;
