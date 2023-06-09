import { deleteDataAPI, getDataAPI, postDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";
import { createNotify } from './notifyAction'

export const REPORT_TYPES = {
    CREATE_REPORT: 'CREATE_REPORT',
    GET_ALL_REPORT: 'GET_ALL_REPORT',
    DELETE_REPORT: 'DELETE_REPORT',
    DELETE_REPORT_ONLY: 'DELETE_REPORT_ONLY',
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

export const deleteReport = ({ report, auth, socket }) => async (dispatch) => {
    console.log({ report });

    try {
        // const res = await deleteDataAPI(`report/${report.reports._id}`, auth.token)

        //-------------------
        await deleteDataAPI(`report/${report._id}`, auth.token)
        dispatch({ type: REPORT_TYPES.DELETE_REPORT, payload: report._id })

        // Gọi API để lấy danh sách báo cáo mới từ backend
        const res = await getDataAPI('reports', auth.token);
        dispatch({ type: REPORT_TYPES.GET_ALL_REPORT, payload: { ...res.data } })

        // console.log(res.reports)
        //------------------------

        const msg = {
            id: report.post._id,
            text: 'đã xóa bài viết của bạn vì vi phạm.',
            recipients: report.user._id,
            url: `/post/${report.post._id}`,
        }

        dispatch(createNotify({ msg, auth, socket }))

    }
    catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}




export const deleteReportOnly = ({ report, auth, socket }) => async (dispatch) => {
    console.log({ report });

    try {
        // const res = await deleteDataAPI(`report/${report.reports._id}`, auth.token)
        //-------------------
        await deleteDataAPI(`reportOnly/${report._id}`, auth.token)
        dispatch({ type: REPORT_TYPES.DELETE_REPORT_ONLY, payload: report._id })

        // Gọi API để lấy danh sách báo cáo mới từ backend
        const res = await getDataAPI('reports', auth.token);
        dispatch({ type: REPORT_TYPES.GET_ALL_REPORT, payload: { ...res.data } })

    }
    catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}
