import React, { useEffect } from 'react'

const Timer = ({ dispatch, secoundsRemaining }) => {
    const mins = Math.floor(secoundsRemaining / 60);
    const secounds = secoundsRemaining % 60;

    useEffect(function () {
        const id = setInterval(function () {
            dispatch({ type: "tick" })
        }, 1000);
        return () => clearInterval(id);
    }, [dispatch])

    return (
        <div className='timer'>
            {mins < 10 && "0"}{mins}
            :
            {secounds < 10 && "0"}{secounds}
        </div>
    )
}

export default Timer