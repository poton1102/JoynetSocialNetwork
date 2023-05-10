import { postDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const REPORT_TYPES = {

    REPORT_POST: 'REPORT_POST',
    CLEAR_REPORT: 'CLEAR_REPORT'
}

export const createReport = ({ post, reportData, auth }) => async (dispatch) => {

    if (reportData.story.length > 200)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Báo cáo của bạn quá dài." } })

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        const res = await postDataAPI(`post/${post._id}/report`, { reportData }, auth.token)

        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}
