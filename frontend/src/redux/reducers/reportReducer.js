import { DeleteData } from "../actions/globalTypes"
import { REPORT_TYPES } from "../actions/reportAction"

const initialState = {
    loading: false,
    reports: [],
    firstLoad: false
}
const reportReducer = (state = initialState, action) => {
    switch (action.type) {

        case REPORT_TYPES.CREATE_REPORT:
            return {
                ...state,
                reports: [action.payload, ...state.reports]
            }

        case REPORT_TYPES.GET_ALL_REPORT:
            return {
                ...state,
                reports: action.payload.reports,
                firstLoad: true
            }
        // case REPORT_TYPES.LOADING_POST:
        //     return {
        //         ...state,
        //         loading: action.payload
        //     };
        case REPORT_TYPES.DELETE_REPORT:
            return {
                ...state,
                // reports: DeleteData(state.reports, action.payload)
                reports: state.reports.filter(report => report._id !== action.payload)
            };
        case REPORT_TYPES.DELETE_REPORT_ONLY:
            return {
                ...state,
                // reports: DeleteData(state.reports, action.payload)
                reports: state.reports.filter(report => report._id !== action.payload)
            };
        default:
            return state
    }
}
export default reportReducer