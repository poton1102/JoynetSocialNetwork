import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Modal,
    Stack, TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../redux/actions/messageAction';
import { getDataAPI, patchDataAPI } from '../../utils/fetchData';
import UserItem from '../UserItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function UpdateGroupChat() {
    const dispatch = useDispatch()
    const { auth, message } = useSelector(state => state)

    const [open, setOpen] = useState(false)
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const searchDebounce = useDebounce(search, 500)

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await getDataAPI(`search?username=${search}`, auth.token);
            setSearchResult(data.users);
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.message
                }
            })
        }
        setLoading(false);
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const { data } = await patchDataAPI(
                `chat/rename`,
                {
                    chatId: message.selectedChat._id,
                    chatName: groupChatName,
                },
                auth.token,
            );
            dispatch({ type: MESS_TYPES.SET_SELECTED_CHAT, payload: data })

        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.message
                }
            })
        }
        setRenameLoading(false);
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (message.selectedChat.users.find((u) => u._id === user1._id)) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "User Already in group!"
                }
            })
            return;
        }

        if (message.selectedChat.groupAdmin._id !== auth.user._id) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Only admins can add someone!"
                }
            })
            return;
        }

        try {
            setLoading(true);
            const { data } = await patchDataAPI(
                `chat/groupadd`,
                {
                    chatId: message.selectedChat._id,
                    userId: user1._id,
                },
                auth.token
            );

            dispatch({ type: MESS_TYPES.SET_SELECTED_CHAT, payload: data })
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Error Occured!"
                }
            })
        }
        setLoading(false);
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (message.selectedChat.groupAdmin._id !== auth.user._id && user1._id !== auth.user._id) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Only admins can remove someone!"
                }
            })
            return;
        }

        try {
            setLoading(true);
            const { data } = await patchDataAPI(
                `chat/groupremove`,
                {
                    chatId: message.selectedChat._id,
                    userId: user1._id,
                },
                auth.token
            );

            user1._id === auth.user._id ? dispatch({ type: MESS_TYPES.SET_SELECTED_CHAT, payload: null }) : dispatch({ type: MESS_TYPES.SET_SELECTED_CHAT, payload: data });

        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Error Occured!"
                }
            })
        }
        setLoading(false);
        setGroupChatName("");
    };

    useEffect(() => {
        if (searchDebounce) {
            handleSearch(searchDebounce)
        }
        // eslint-disable-next-line
    }, [searchDebounce])
    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <VisibilityIcon />
            </IconButton>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <Stack spacing={2} sx={style}>
                    <Typography variant="h2">{message.selectedChat.chatName}</Typography>

                    <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
                        {message.selectedChat.users.map((u) => (
                            <Chip
                                key={u._id}
                                label={`${u.username}${message.selectedChat.groupAdmin._id === u._id ? ' (Admin)' : ''}`}
                                onDelete={() => handleRemove(u)}
                            />
                        ))}
                    </Stack>

                    <Stack spacing={2}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                            <TextField
                                label='Chat name'
                                type='text'
                                sx={{ flex: 1 }}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button variant='contained' disabled={renameloading} onClick={handleRename}>Update</Button>
                        </Stack>
                        <TextField
                            label='Add users'
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Stack>

                    {loading ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress sx={{ color: 'grey.500' }} />
                        </Box>
                    ) : (
                        <>
                            {
                                searchResult.length > 0 &&
                                <List>
                                    {searchResult
                                        ?.slice(0, 4).map(user => (
                                            user._id !== auth.user._id ?
                                                <UserItem key={user._id} user={user} onClick={() => handleAddUser(user)} />
                                                : null
                                        ))}
                                </List>
                            }
                        </>
                    )}
                    <Button variant="contained" color="error" onClick={() => handleRemove(auth.user)}>Leave Group</Button>
                </Stack>
            </Modal>
        </>
    )
}

export default UpdateGroupChat