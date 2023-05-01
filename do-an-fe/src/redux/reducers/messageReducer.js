import { DeleteData, EditData } from "../actions/globalTypes";
import { MESS_TYPES } from "../actions/messageAction";

const initialState = {
    //mảng data user add vào list chat
    users: [],
    resultUsers: 0,
    //nội dung của mảng hội thoại
    data: [],
    // resultData: 0,
    firstLoad: false
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESS_TYPES.ADD_USER:
            if (state.users.every(item => item._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.users]
                }
                // dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
            }
            return state;
        // return { ...state, users: [...state.users, action.payload] }
        //     khác với  return { ...state, users: [action.payload, ...state.users] }, add vào thì nó hiện ngược lại list

        case MESS_TYPES.ADD_MESSAGE:
            return {
                ...state,
                // data: [...state.data, action.payload],
                data: state.data.map(item =>
                    item._id === action.payload.recipient || item._id === action.payload.sender
                        ? {
                            ...item,
                            messages: [...item.messages, action.payload],
                            result: item.result + 1
                        }
                        : item
                ),
                users: state.users.map(
                    user => user._id === action.payload.recipient || user._id === action.payload.sender
                        ? { ...user, text: action.payload.text, media: action.payload.media }
                        : user
                )
            };
        case MESS_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                // users: [...state.users, action.payload]
                users: action.payload.newArr,//sau khi đã lọc
                resultUsers: action.payload.result,//lấy result từ ctrl
                firstLoad: true
            };

        case MESS_TYPES.GET_MESSAGES:
            return {
                ...state,
                // data: action.payload.messages.reverse(),
                data: [...state.data, action.payload]
                // resultData: action.payload.result,//lấy result từ ctrl
            };
        case MESS_TYPES.UPDATE_MESSAGES:
            console.log(action.payload)
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            };
        case MESS_TYPES.DELETE_MESSAGES:
            return {
                ...state,
                // chua thong tin mang moi, cap nhat mang moi, tim id
                data: state.data.map(item =>
                    item._id === action.payload._id
                        ? { ...item, messages: action.payload.newData }
                        : item
                )
            };
        case MESS_TYPES.DELETE_CONVERSATION:
            return {
                ...state,
                users: DeleteData(state.users, action.payload),
                data: DeleteData(state.data, action.payload)
            }
        case MESS_TYPES.CHECK_ONLINE_OFFLINE:
            return {
                ...state,
                users: state.users.map(user =>
                    action.payload.includes(user._id) ? { ...user, online: true } : { ...user, online: false }
                ),

            }
        default:
            return state;
    }
}


export default messageReducer