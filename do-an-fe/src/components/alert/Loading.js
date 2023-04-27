import React from 'react'
import LoadIcon from '../../images/load.svg'

const Loading = () => {
    return (
        <div className="position-fixed w-100 h-100 text-center loading"
            style={{ background: "#0008", color: "#0008", top: 0, left: 0, zIndex: 50 }}>

            {/* <svg width="205" height="250" viewBox="0 0 40 50">
                <polygon stroke="#fff" strokeWidth="1" fill="none"
                points="20,1 40,40 1,40" />
                <text fill="#fff" x="5" y="47">Loading</text>
            </svg> */}

            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />

        </div>
    )
}

export default Loading
