import { useDispatch, useSelector } from "react-redux";
import Avatar from "../Avatar";
import { useEffect, useState } from "react";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

function CallModal() {
    const { call, auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const [mins, setMins] = useState(0)
    const [second, setSecond] = useState(0)
    const [total, setTotal] = useState(0)


    const [answer, setAnswer] = useState(false)

    //setTime
    useEffect(() => {
        const setTime = () => {
            setTotal(t => t + 1)
            setTimeout(setTime, 1000)
        }
        setTime()

        return () => setTotal(0)
    }, [])

    useEffect(() => {
        setSecond(total % 60)
        setMins(parseInt(total / 60))
    }, [total])

    //end call
    const handleEndClick = () => {
        dispatch({ type: GLOBALTYPES.CALL, payload: null })
    }

    useEffect(() => {
        if (answer) {
            setTotal(0)
        }
        const timer = setTimeout(() => {
            dispatch({ type: GLOBALTYPES.CALL, payload: null })
        }, 15000)
        return () => clearTimeout(timer)
    }, [dispatch, answer])

    //answer call
    const handleAnswer = () => {
        setAnswer(true)
    }


    return (
        <div className="call_modal">
            <div className="call_box">
                <div className="text-center" style={{ padding: '40px 0' }}>
                    <Avatar src={call.avatar} size="supper-avatar" />
                    <h4>{call.username}</h4>
                    <h6>{call.fullname}</h6>
                    <div>
                        {
                            call.video ?
                                <span>calling video...</span>
                                : <span>calling audio...</span>
                        }
                    </div>
                </div>
                <div className="timer">
                    <small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
                    <small>:</small>
                    <small>{second.toString().length < 2 ? '0' + second : second}</small>
                </div>

                <div className="call_menu">
                    <button className="material-icons text-danger"
                        onClick={handleEndClick}>
                        call_end
                    </button>

                    {
                        // (call.recipient === auth.user._id) &&
                        <>
                            {
                                call.video
                                    ? <button className="material-icons text-success"
                                        onClick={handleAnswer}
                                    >
                                        videocam
                                    </button>
                                    :
                                    <button className="material-icons text-success"
                                        onClick={handleAnswer}
                                    >
                                        call
                                    </button>
                            }
                        </>
                    }
                </div>

            </div>
        </div >
    );
}

export default CallModal;