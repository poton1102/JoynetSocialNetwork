import React from 'react'
import CardHeader from '@mui/material/CardHeader'
import Skeleton from '@mui/material/Skeleton'
function UserCard({ primaryWidth = "20%", secondaryWidth = "10%" }) {
    return (
        <CardHeader
            avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
            action={null}
            title={<Skeleton animation="wave" height={10} width={primaryWidth} style={{ marginBottom: 6 }} />}
            subheader={<Skeleton animation="wave" height={10} width={secondaryWidth} />}
        />
    )
}

export default UserCard