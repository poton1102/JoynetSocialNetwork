import { useEffect, useRef, useState } from "react";
import UserCard from '../UserCard'
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { getDataAPI } from "../../utils/fetchData";
import { useHistory, useParams } from "react-router-dom";
import { MESS_TYPES, addUser, getConversations } from "../../redux/actions/messageAction";

function LeftSide() {
    const { auth, message, online } = useSelector(state => state)
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUser] = useState([])
    const history = useHistory()

    const { id } = useParams()

    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    //hiện ra mảng ds user sau khi search
    const handleSearch = async (e) => {
        e.preventDefault()

        if (!search) return setSearchUser([]);

        try {
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            setSearchUser(res.data.users)

        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }
            })
        }
    }
    //nếu chọn 1 thằng thì sẽ reset lại cả mảng user sau khi search để tìm thằng khác
    const handleAddUser = (user) => {
        // console.log(user)
        setSearch('')
        setSearchUser([])
        dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
        return history.push(`/message/${user._id}`)
    }

    const isActive = (user) => {
        if (id === user._id) {
            return 'active'
        }
        return ''
    }
    //
    useEffect(() => {
        if (message.firstLoad) return;
        dispatch(getConversations({ auth }));
    }, [dispatch, auth, message.firstLoad])

    //load more, kiểu kéo lên thì +1
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setPage])

    useEffect(() => {
        if (message.resultUsers >= (page - 1) * 9 && page > 1) {
            dispatch(getConversations({ auth, page }))
        }
    }, [message.resultUsers, page, auth, dispatch])

    //check user online-offline
    useEffect(() => {
        if (message.firstLoad) dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
    }, [online, message.firstLoad, dispatch])


    return (
        <>
            <form className="message_header" onSubmit={handleSearch} >
                <input type="text" value={search}
                    placeholder="Enter to Search..."
                    onChange={e => setSearch(e.target.value)} />

                <button type="submit" style={{ display: 'none' }}>Search</button>
            </form>
            <div className="message_chat_list">
                {
                    searchUsers.length !== 0
                        ?
                        <>
                            {
                                searchUsers.map(user => (
                                    <div key={user._id} className={`message_user ${isActive(user)}`} onClick={() => handleAddUser(user)}>
                                        <UserCard user={user} />
                                    </div>

                                ))
                            }

                        </> : <>
                            {/* lẩy ra mảng ds đã được add khi mảng ds user sau khi search bằng 0*/}
                            {
                                message.users.map(user => (
                                    <div key={user._id} className={`message_user ${isActive(user)}`} onClick={() => handleAddUser(user)}>
                                        <UserCard user={user} msg={true}>
                                            {
                                                user.online ? <i className="fas fa-circle text-success" /> :
                                                    auth.user.following.find(item => item._id === user._id) && <i className="fas fa-circle" />
                                            }

                                        </UserCard>
                                    </div>
                                ))
                            }
                        </>

                }
                <button ref={pageEnd} style={{ opacity: 0 }} >Load More</button>

            </div>
        </>
    );
}

export default LeftSide;