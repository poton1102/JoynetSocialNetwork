import GroupAddIcon from '@mui/icons-material/GroupAdd';
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
import { getDataAPI, postDataAPI } from '../../utils/fetchData';
import UserItem from '../UserItem'

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

function GroupChat() {
    const dispatch = useDispatch()
    const { auth } = useSelector(state => state)

    const [open, setOpen] = useState(false)
    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchDebounce = useDebounce(search, 500)

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "User already added"
                }
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

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

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Please fill all the feilds"
                }
            })
            return;
        }

        try {
            const { data } = await postDataAPI(
                `chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                auth.token,
            );
            dispatch({ type: MESS_TYPES.ADD_CHAT, payload: data })
            setOpen(false);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: "New Group Chat Created!"
                }
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Failed to Create the Chat!"
                }
            })
        }
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
                <GroupAddIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <Stack spacing={2} sx={style}>
                    <Typography variant="h2">Create Group Chat</Typography>
                    <Stack spacing={2}>
                        <TextField
                            label='Chat name'
                            type='text'
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <TextField
                            label='Add users'
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Stack>
                    {
                        selectedUsers.length > 0 &&
                        <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
                            {selectedUsers.map((u) => (
                                <Chip
                                    key={u._id}
                                    label={u.username}
                                    onDelete={() => handleDelete(u)}
                                />
                            ))}
                        </Stack>
                    }
                    {loading ? (
                        // <ChatLoading />
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
                                                <UserItem key={user._id} user={user} onClick={() => handleGroup(user)} />
                                                : null
                                        ))}
                                </List>
                            }
                        </>
                    )}
                    <Button variant="contained" onClick={handleSubmit}>Create Chat</Button>
                </Stack>
            </Modal>
        </>
    )
}

export default GroupChat