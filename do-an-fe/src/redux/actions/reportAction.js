import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const REPORT_TYPES = {
    CREATE_REPORT: 'CREATE_REPORT',
    GET_ALL_REPORT: 'GET_ALL_REPORT',
    DELETE_REPORT: 'DELETE_REPORT'
}

export const createReport = ({ post, reportData, auth }) => async (dispatch) => {

    if (reportData.length > 200)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Báo cáo chỉ được tối đa 200 ký tự." } })

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        const res = await postDataAPI(`post/${post._id}/report`, { reportData }, auth.token)

        dispatch({
            type: REPORT_TYPES.CREATE_REPORT,
            payload: { ...res.data.newReport, reporter: auth.user }
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    }
    catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const getAllReports = (token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        const res = await getDataAPI('reports', token)
        // console.log(res.data)

        dispatch({
            type: REPORT_TYPES.GET_ALL_REPORT,
            payload: { ...res.data }
        })

        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    }
    catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}

export const deleteReport = ({ reportId, auth, socket }) => async (dispatch) => {
    // console.log({post,auth})

    try {
        // const res = await deleteDataAPI(`report/${report.reports._id}`, auth.token)
        await deleteDataAPI(`report/${reportId}`, auth.token)
        dispatch({ type: REPORT_TYPES.DELETE_REPORT, payload: reportId })

        // Gọi API để lấy danh sách báo cáo mới từ backend
        const res = await getDataAPI('reports', auth.token);
        dispatch({ type: REPORT_TYPES.GET_ALL_REPORT, payload: { ...res.data } })

        // console.log(res)
        // Notify
        const msg = {
            id: reportId,
            text: 'đã xóa bài viết của bạn vì vi phạm.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${reportId}`,
        }

        // dispatch(removeNotify({ msg, auth, socket }))
        // Notify
        // const msg = {
        //     id: post._id,
        //     text: 'added a new post.',
        //     recipients: res.data.newPost.user.followers,
        //     url: `/post/${post._id}`,
        // }

        // dispatch(removeNotify({ msg, auth, socket }))
    }
    catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}


