
import React, { useState } from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Followers from './profile/Followers'
import Following from './profile/Following'

const UserCardBig = ({ children, user, border, handleClose, msg }) => {

    const { theme } = useSelector(state => state)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const handleCloseAll = () => {
        if (handleClose) handleClose()
        if (setShowFollowers) setShowFollowers(false)
        if (setShowFollowing) setShowFollowing(false)
    }

    // const [userData, setUserData] = useState([])
    // const [onEdit, setOnEdit] = useState(false)

    // const [showFollowers, setShowFollowers] = useState(false)
    // const [showFollowing, setShowFollowing] = useState(false)

    const showMsg = (user) => {
        return (
            <>
                <div style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
                    {user.text}
                </div>
                {
                    user.media.length > 0 &&
                    <div>
                        {user.media.length} <i className="fas fa-image" />
                    </div>
                }
            </>
        )
    }


    return (
        <div className={`border border-primary d-flex flex-column p-2 align-items-center justify-content-between w-100 ${border} rounded-lg`} style={{ backgroundColor: 'rgba(1, 90, 128, 1)' }}>
            <div >
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
                    className="align-items-center">



                    <div className="ml-1 d-flex align-items-center flex-column text-dark" style={{ transform: 'translateY(-5px)', cursor: 'pointer' }}>
                        <Avatar src={user.avatar} size="supper-avatar " />
                        <span className="d-block text-light" >#{user.username}</span>
                        <small className='text-light' >
                            {
                                msg
                                    ? showMsg(user)
                                    : user.fullname
                            }
                        </small>

                    </div>
                </Link>
                <div className="ml-1 d-flex align-items-center flex-column text-dark">
                    <span className="d-block pe-auto text-light" onClick={() => setShowFollowing(true)} style={{ cursor: 'pointer' }}> Đang theo dõi {user.following.length}</span>
                    <span className="d-block pe-auto text-light" onClick={() => setShowFollowers(true)} style={{ cursor: 'pointer' }}>Số người đang theo dõi {user.followers.length}</span>
                </div>

                {
                    showFollowers &&
                    <Followers
                        users={user.followers}
                        setShowFollowers={setShowFollowers}
                    />
                }
                {
                    showFollowing &&
                    <Following
                        users={user.following}
                        setShowFollowing={setShowFollowing}
                    />
                }
            </div>

            {children}
        </div >
    )
}

export default UserCardBig
