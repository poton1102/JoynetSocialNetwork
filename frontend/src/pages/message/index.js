import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import useTheme from '@mui/material/styles/useTheme'
import React from 'react'
import { useSelector } from 'react-redux'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'

const Message = () => {
    const { message } = useSelector(state => state)

    return (
        <Stack direction='row' sx={{ background: '#fff', marginTop: '100px', mx: 3, boxShadow: 2, borderRadius: 1, height: '80vh' }}>
            <Stack sx={{ flexBasis: '30%' }}>
                <LeftSide />
            </Stack>
            <Divider orientation="vertical" flexItem />
            {message.selectedChat ?
                <RightSide /> :
                <Box sx={{ flex: 1 }}>
                    <div className="d-flex justify-content-center 
                align-items-center flex-column h-100">
                        <h4>Click on a user to start chatting</h4>
                    </div>
                </Box>
            }
        </Stack>
    )
}

export default Message
