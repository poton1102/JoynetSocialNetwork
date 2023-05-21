import React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'

function UserItem({ user, ...props }) {
    return (
        <ListItemButton {...props}>
            <ListItemAvatar>
                <Avatar alt={user.username} src={user.avatar} />
            </ListItemAvatar>
            <ListItemText
                primary={user.fullname} secondary={user.username}
            />
        </ListItemButton>
    )
}

export default UserItem