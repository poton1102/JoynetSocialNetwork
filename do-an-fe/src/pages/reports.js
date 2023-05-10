import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

function Report() {
    const { auth } = useSelector(state => state)

    if (auth.user.role !== 'admin') {
        return <Redirect to="/" />
    }
    return (
        <div className='mt-70'>
            <h1>Reported Posts List</h1>

            <div style={{ overflowX: "auto" }}>
                <table className="customers">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người tố cáo</th>
                            <th>Bài viết</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>A</td>
                            <td>B</td>
                            <td>C</td>
                            <td>D</td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Report;