import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData"
import { DeleteData, GLOBALTYPES } from "./globalTypes"

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'

}
// export const addUser = ({ user, message }) => dispatch => {
//     //kiểm tra user._id trong mảng message.users có khác user._id trong mảng vừa search được hay hay không?
//     //Nếu add vào chat rồi thì thôi, tránh lặp lại add vào chat 2 lần
//     if (message.users.every(item => item._id !== user._id)) {
//         dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
//     }
// }

export const addMessage = ({ msg, auth, socket }) => async dispatch => {
    // console.log(msg)
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg })
    const { _id, avatar, fullname, username } = auth.user
    socket.emit('addMessage', { ...msg, user: { _id, avatar, fullname, username } })
    try {
        await postDataAPI('message', msg, auth.token);
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const getConversations = ({ auth, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token)

        let newArr = []
        res.data.conversations.forEach(item => {
            //lọc ra thằng auth.user._id, ko cho add chính nó vào đoạn hội thoại
            item.recipients.forEach(cv => {
                if (cv._id !== auth.user._id) {
                    newArr.push({ ...cv, text: item.text, media: item.media, call: item.call })
                    // newArr.push({ cv })
                }
            })
        })
        // console.log(newArr)
        dispatch({ type: MESS_TYPES.GET_CONVERSATIONS, payload: { newArr, result: res.data.result } })
    }
    catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const getMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        // console.log(res)
        const newData = { ...res.data, messages: res.data.messages.reverse() }
        // console.log(newData)
        dispatch({ type: MESS_TYPES.GET_MESSAGES, payload: { ...newData, _id: id, page } })
    }
    catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const loadMoreMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        const newData = { ...res.data, messages: res.data.messages.reverse() }

        dispatch({ type: MESS_TYPES.UPDATE_MESSAGES, payload: { ...newData, _id: id, page } })
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}
export const deleteMessages = ({ msg, data, auth }) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    console.log(newData)
    dispatch({ type: MESS_TYPES.DELETE_MESSAGES, payload: { newData, _id: msg.recipient } })
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}

export const deleteConversation = ({ auth, id }) => async (dispatch) => {

    dispatch({ type: MESS_TYPES.DELETE_CONVERSATION, payload: id })
    try {
        await deleteDataAPI(`conversation/${id}`, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}