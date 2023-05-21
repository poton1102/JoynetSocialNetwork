import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import React from 'react'
import CardHeader from './UserCard'
function Post() {
    return (
        <Card sx={{ my: 2 }}>
            <CardHeader />
            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />

            <CardContent>
                <React.Fragment>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} width="80%" />
                </React.Fragment>
            </CardContent>
        </Card>
    )
}

export default Post