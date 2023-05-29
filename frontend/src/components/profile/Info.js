import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getProfileUsers } from "../../redux/actions/profileAction";
import Avatar from "../Avatar";
import FollowBtn from "../FollowBtn";
import EditProfile from "./EditProfile";
import Followers from "./Followers";
import Following from "./Following";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
function Info({ id, auth, profile, dispatch }) {
    // console.log(useParams())
    //mã id trên thanh url
    // const { id } = useParams()
    // const { auth, profile } = useSelector(state => state)
    // const dispatch = useDispatch()
    const [userData, setUserData] = useState([])
    const [onEdit, setOnEdit] = useState(false)

    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)

    useEffect(() => {
        if (id === auth.user._id) {
            setUserData([auth.user])
        }
        else {
            //lấy thông tin user bao gồm profile users, id là mã user(trên url),auth để xác thực token
            // dispatch(getProfileUsers({ users: profile.users, id, auth }))
            const newData = profile.users.filter(user => user._id === id)
            setUserData(newData)
        }
    }, [id, auth, dispatch, profile.users])


    useEffect(() => {
        if (showFollowers || showFollowing || onEdit) {
            dispatch({ type: GLOBALTYPES.MODAL, payload: true })
        }
        else {
            dispatch({ type: GLOBALTYPES.MODAL, payload: false })
        }
    }, [showFollowers, showFollowing, onEdit, dispatch])

    return (

        <div className="info " >
            {
                userData.map(user => (
                    <div className="info_container" key={user._id}>
                        <Avatar src={user.avatar} size="supper-avatar" />
                        <div className="info_content">
                            <div className="info_content_title">
                                <h2>{user.username}</h2>
                                {
                                    //nếu không phải là nick mình thì sang nick khác sẽ hiện follow
                                    user._id === auth.user._id
                                        ? <button className="btn btn-info"
                                            onClick={() => setOnEdit(true)}>
                                            Sửa thông tin
                                        </button>

                                        : <FollowBtn user={user} />
                                }
                            </div>

                            <div className="follow_btn">
                                <span className="mr-4"
                                    onClick={() => setShowFollowers(true)}
                                >
                                    {user.followers.length} người theo dõi
                                </span>
                                <span className="ml-4"
                                    onClick={() => setShowFollowing(true)}
                                >
                                    Đang theo dõi {user.following.length} người dùng
                                </span>
                            </div>

                            <h6>{user.fullname} <span className="text-danger">{user.mobile}</span></h6>
                            <p className="m-0">{user.address}</p>
                            <h6 className="m-0">{user.email}</h6>
                            <a href={user.website} target="_blank" rel="noreferrer">
                                {user.website}
                            </a>
                            <p>{user.story}</p>
                        </div>

                        {
                            onEdit && <EditProfile setOnEdit={setOnEdit} />
                        }


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

                ))}
        </div >
    );
}

export default Info;