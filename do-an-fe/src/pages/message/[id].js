import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import RightSide from '../../components/message/RightSide'

const Conversation = () => {
    return (
        <div className="message d-flex mt-70 main">
            <div className="col-md-4 border-right px-0 left_mess mt-70">
                <LeftSide />
            </div>

            <div className="col-md-8 px-0 mt-70">
                <RightSide />
            </div>
        </div>
    )
}

export default Conversation
