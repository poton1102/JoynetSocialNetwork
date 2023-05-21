import React, { useEffect, useState } from 'react'

let timerId;

function useDebounce(value, timer) {
    const [data, setData] = useState(value);

    useEffect(() => {
        if (timerId) clearTimeout(timerId);

        timerId = setTimeout(() => {
            setData(value)
        }, timer)

    }, [value, timer])

    return data
}

export default useDebounce