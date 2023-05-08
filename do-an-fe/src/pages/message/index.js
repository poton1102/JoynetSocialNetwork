import React from 'react'
import LeftSide from '../../components/message/LeftSide'

const Message = () => {
    return (
        <div className="message d-flex mt-70 main ">
            <div className="col-md-4 border-right px-0 mt-70">
                <LeftSide />
            </div>

            <div className="col-md-8 px-0 right_mess mt-70">
                <div className="d-flex justify-content-center align-items-center flex-column h-100">

                    <i className="fab fa-facebook-messenger text-primary"
                        style={{ fontSize: '5rem' }} />
                    <h4>Messenger</h4>
                </div>
            </div>
        </div>
    )
}

export default Message
