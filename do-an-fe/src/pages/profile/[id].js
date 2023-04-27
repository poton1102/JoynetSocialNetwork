import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Info from '../../components/profile/Info'
import Posts from '../../components/profile/Posts'
import Saved from '../../components/profile/Saved'
import LoadIcon from '../../images/loading.gif'
import { getProfileUsers } from '../../redux/actions/profileAction'
const Profile = () => {
    const { profile, auth } = useSelector(state => state)
    const { id } = useParams()
    const dispatch = useDispatch()
    const [saveTab, setSaveTab] = useState(false)
    useEffect(() => {
        // window.scrollTo(0);
        //nếu item khác id trên thanh url hiện tại thì sẽ chuyển hướng
        if (profile.ids.every(item => item !== id)) {
            dispatch(getProfileUsers({ id, auth }))
        }

    }, [id, auth, dispatch])

    return (
        <div className='profile mt-70' >
            <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
            {
                auth.user._id === id &&
                <div className="profile_tab">
                    <button className={saveTab ? '' : 'active'} onClick={() => setSaveTab(false)}>Posts</button>
                    <button className={saveTab ? 'active' : ''} onClick={() => setSaveTab(true)}>Saved</button>
                </div>
            }

            {
                profile.loading
                    ? <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
                    : <>
                        {
                            saveTab
                                ? <Saved auth={auth} dispatch={dispatch} />
                                : <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
                        }
                    </>
            }
        </div>
    )

}

export default Profile
