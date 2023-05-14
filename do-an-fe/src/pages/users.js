import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { deleteReport, getAllReports } from '../redux/actions/reportAction'
import moment from 'moment'
function Report() {
    const { auth, report, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)

    useEffect(() => {
        // if (!report.firstLoad) {
        dispatch(getAllReports(auth.token))
        // }
    }, [dispatch, auth.token])

    const handleDeleteReport = (reportId) => {
        if (window.confirm('Do you want to delete?')) {
            dispatch(deleteReport({ reportId, auth, socket }))
        }
    }
    // console.log(report.reports)
    if (auth.user.role !== 'admin') {
        return <Redirect to="/" />
    }



    return (
        <div className='mt-70'>
            <div className='text-center123'>
                <h1>Báo cáo các bài viết</h1>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="customers">
                    <thead>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Người báo cáo</th>
                            <th>Người chủ bài viết</th>
                            <th>Link bài viết</th>
                            <th>Nội dung báo cáo</th>
                            <th>Thời gian báo cáo</th>
                            <th>Hành động</th>

                        </tr>
                    </thead>
                    <tbody>
                        {report.reports.map((report, index) => (

                            <tr key={report._id}>
                                <td>{index + 1}</td>
                                <td>{report.reporter.username}</td>
                                <td>{report.user.username}</td>
                                <td> <a href={`http://localhost:3000/post/${report.post._id}`} target="_blank" rel="noopener noreferrer">
                                    {report.post._id}
                                </a></td>
                                <td>{report.reason}</td>
                                <td> {moment(report.createdAt).fromNow()}</td>

                                <td>
                                    <i className="fas fa-trash text-primary"
                                        onClick={() => handleDeleteReport(report._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Report;