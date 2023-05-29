import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow } from "../redux/actions/profileAction";
import { unfollow } from "../redux/actions/profileAction";

function FollowBtn({ user }) {
    // console.log({ user })
    const [followed, setFollowed] = useState(false)

    const { auth, profile, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
    useEffect(() => {
        if (auth.user.following.find(item => item._id === user._id)) {
            setFollowed(true)
        }
        return () => setFollowed(false)
    }, [auth.user.following, user._id])


    const handleFollow = async () => {
        if (load) return;
        setFollowed(true)
        setLoad(true)
        await dispatch(follow({ users: profile.users, user, auth, socket }))
        setLoad(false)
    }
    const handleUnFollow = async () => {
        if (load) return;
        setFollowed(false)
        setLoad(true)
        await dispatch(unfollow({ users: profile.users, user, auth, socket }))
        setLoad(false)
    }

    return (
        <>
            {
                followed
                    ? <button className="btn btn-danger"
                        onClick={handleUnFollow}>
                        Bỏ theo dõi
                    </button>
                    : <button className="btn btn-success"
                        onClick={handleFollow}>
                        Theo dõi
                    </button>
            }
        </>
    );
}

export default FollowBtn;