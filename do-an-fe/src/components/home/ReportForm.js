import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { GLOBALTYPES } from "../../redux/actions/globalTypes"
import { createReport } from "../../redux/actions/reportAction"
function ReportForm({ setOnEdit, post }) {
    // console.log(post)
    const initState = {
        reports: '',
        user: ''
    }

    const [reportData, setReportData] = useState(initState)

    const { reports } = reportData

    const { auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()


    useEffect(() => {
        setReportData(auth.user)
    }, [auth.user])

    //để xử lý input, lưu giá trị vào user
    const handleInput = e => {
        // const { name, value } = e.target
        // setReportData({ ...reportData, [name]: value })
        const { value } = e.target;
        setReportData(value);
        //1 mang gom fullname, mobile,... de set cho thằng state
    }

    const handleSubmit = e => {
        e.preventDefault()
        // dispatch(updateProfileUser({ userData, avatar, auth }))
        dispatch(createReport({ post, reportData: reportData, auth }))
        setOnEdit(false)
        // console.log(post)
    }

    return (
        <div className="edit_profile mt-70" onSubmit={handleSubmit}>
            <button className="btn btn-danger btn_close"
                onClick={() => setOnEdit(false)}>
                Close
            </button>

            <div className="mt-140">
                <form >
                    <h1>Báo cáo bài viết</h1>

                    <div className="form-group ">
                        <label htmlFor="story">Nội dung báo cáo</label>
                        <textarea name="story" value={reports} cols="30" rows="4"
                            className="form-control" onChange={handleInput} />

                        {/* <small className="text-danger d-block text-right">
                            {reports.length}/200
                        </small> */}
                    </div>

                    <button className="btn btn-info w-100" type="submit">Gửi báo cáo</button>
                </form>
            </div>
        </div>
    );
}

export default ReportForm;