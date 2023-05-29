import { MESS_TYPES } from '../actions/messageAction'
import { EditData, DeleteData } from '../actions/globalTypes'

// const initialState = {
//     users: [],
//     resultUsers: 0,
//     data: [],
//     firstLoad: false
// }

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false,

    chats: [],
    selectedChat: null,
    chatsLength: 0,
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESS_TYPES.ADD_CHAT:
            if (state.chats.every(item => item._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.chats]
                };
            }
            return state;
        case MESS_TYPES.ADD_MESSAGE:
            return {
                ...state,
                data: state.data.map(item =>
                    item._id === action.payload.recipient || item._id === action.payload.sender
                        ? {
                            ...item,
                            messages: [...item.messages, action.payload],
                            result: item.result + 1
                        }
                        : item
                ),
                users: state.users.map(user =>
                    user._id === action.payload.recipient || user._id === action.payload.sender
                        ? {
                            ...user,
                            text: action.payload.text,
                            media: action.payload.media,
                            call: action.payload.call
                        }
                        : user
                )
            };
        case MESS_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                chats: [...state.chats, ...action.payload.chats],
                chatLengths: state.chatsLength + action.payload.chatsLength
            };
        case MESS_TYPES.SET_SELECTED_CHAT:
            return {
                ...state,
                selectedChat: action.payload,
            };
        case MESS_TYPES.GET_MESSAGES:
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        case MESS_TYPES.UPDATE_MESSAGES:
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            };
        case MESS_TYPES.DELETE_MESSAGES:
            return {
                ...state,
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
            };
        case MESS_TYPES.CHECK_ONLINE_OFFLINE:
            return {
                ...state,
                users: state.users.map(user =>
                    action.payload.includes(user._id)
                        ? { ...user, online: true }
                        : { ...user, online: false }
                )
            };
        default:
            return state;
    }
}

export default messageReducer;