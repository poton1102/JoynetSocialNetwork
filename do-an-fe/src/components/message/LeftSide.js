import SearchIcon from '@mui/icons-material/Search'
import {
    Avatar,
    Badge,
    Box, Divider, Drawer,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack, Typography, useTheme
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useDebounce from '../../hooks/useDebounce'
import useIntersectionObserver from '../../hooks/useIntersectionObserver'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { MESS_TYPES, accessChat, getConversations } from '../../redux/actions/messageAction'
import { getSenderFull } from '../../utils/chatLogic'
import { getDataAPI } from '../../utils/fetchData'
import {
    SearchIconWrapper,
    SearchMaterial,
    StyledInputBase
} from '../Search'
import { SmallAvatar, StyledBadge } from '../StyleBadge'
import UserItem from '../UserItem'
import UserCardSkeleton from '../skeleton/UserCard'
import GroupChat from './GroupChat'

const LeftSide = () => {
    const { auth, message, online } = useSelector(state => state)
    const dispatch = useDispatch()
    const { palette } = useTheme()

    const [search, setSearch] = useState('')
    const searchDebounce = useDebounce(search, 500)

    const [searchUsers, setSearchUsers] = useState([])

    const [load, setLoad] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)

    const [page, setPage] = useState(1)
    const [hasMoreConversastions, setHasMoreConservations] = useState(true);

    const [firstLoading, setFirstLoading] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchDebounce) => {
        try {
            setLoad(true)
            const res = await getDataAPI(`search?username=${searchDebounce}`, auth.token)
            setSearchUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }
            })
        }
        setLoad(false)
    }

    const handleCloseDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenDrawer(!openDrawer)
    }

    const fetchMoreRef = useIntersectionObserver(() => {
        if (loading) return;
        setPage(page + 1)
    });

    const fetchConservations = async (firstLoad) => {
        if (loading) return;

        try {
            if (firstLoad) setFirstLoading(true)

            setLoading(true);

            const data = await dispatch(getConversations({ auth, page }))

            if (data.chatsLength === 0) {
                setHasMoreConservations(false)
            }

        } catch (error) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.msg } })
        }
        setFirstLoading(false)
        setLoading(false);
    };

    useEffect(() => {
        fetchConservations(true)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (page > 1) fetchConservations(false)
        // eslint-disable-next-line
    }, [page])


    useEffect(() => {
        if (searchDebounce) {
            handleSearch(searchDebounce)
        } else {
            setSearchUsers([])
        }
        // eslint-disable-next-line
    }, [searchDebounce, auth.token, dispatch])

    return (
        <>
            <Box sx={{ py: 2, px: 1 }}>
                <Stack direction='row' spacing={2}>
                    <Stack direction='row' alignItems='center' spacing={1} sx={{ py: 1, px: 2, borderRadius: 4, cursor: 'pointer', background: '#ffff', flex: 1, '&:hover': { opacity: 0.6 } }} onClick={() => setOpenDrawer(!openDrawer)}>
                        <SearchIcon />
                        <Typography component='span' variant='h6'>Search Messenger</Typography>
                    </Stack>
                    <GroupChat />
                </Stack>
                <Drawer
                    anchor='left'
                    open={openDrawer}
                    onClose={handleCloseDrawer}
                >
                    <Box sx={{ py: 2, px: 1 }}>
                        <SearchMaterial>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                onChange={e => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
                            />
                            {load &&
                                <Box className='dots-7' sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} />
                            }
                        </SearchMaterial>
                    </Box>
                    <Divider />
                    {searchUsers.length > 0 &&
                        <List>
                            {searchUsers.map(user => (
                                user._id !== auth.user._id ?
                                    <UserItem key={user._id} user={user} onClick={() => dispatch(accessChat({ userId: user._id, auth }))} />
                                    : null
                            ))}
                        </List>
                    }
                </Drawer>
            </Box>
            <Divider />
            <List sx={{ overflow: 'auto' }}>
                {
                    message.chats.map((chat, index) => {
                        const user = !chat.isGroupChat && getSenderFull(auth.user, chat.users)
                        return (
                            <ListItemButton key={chat._id}
                                sx={{
                                    bgcolor: message.selectedChat?._id === chat._id && '#fff', '&:hover': {
                                        bgcolor: 'blue'
                                    }
                                }}
                                ref={((index === message.chats.length - 1) && hasMoreConversastions) ? fetchMoreRef : null}
                                onClick={() => dispatch({ type: MESS_TYPES.SET_SELECTED_CHAT, payload: chat })}
                            >
                                <ListItemAvatar>
                                    {!chat.isGroupChat ?
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant={online.includes(user._id) ? 'dot' : ''}
                                        >
                                            <Avatar src={user.avatar} />
                                        </StyledBadge> :
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                <SmallAvatar src={chat.users[0].avatar} />
                                            }
                                        >
                                            <Avatar src={chat.users[1].avatar} />
                                        </Badge>
                                    }
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user ? user.username : chat.chatName} secondary={chat.latestMessage ? `${chat.latestMessage.sender.username} : ${chat.latestMessage.content.length > 50 ? chat.latestMessage.content.substring(0, 51) + "..." : chat.latestMessage.content}` : null}
                                />
                            </ListItemButton>
                        )
                    }
                    )
                }
                {firstLoading &&
                    <>
                        {
                            Array.from({ length: 5 }).map((_, i) =>
                                <ListItemButton key={i}>
                                    <UserCardSkeleton />
                                </ListItemButton>
                            )
                        }
                    </>

                }
            </List>
        </>
    )
}


export default LeftSide
