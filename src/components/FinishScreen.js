import React from 'react'

function getEmoji(percentage) {
    if (percentage === 100) return '🎖'
    if (percentage >= 80) return '🎉'
    if (percentage >= 50) return '🤩'
    if (percentage <= 50) return '😉'
    if (percentage === 0) return '🙄'
}

const FinishScreen = ({ dispatch, points, maxPossiblePoints, highscore }) => {
    const percentage = (points / maxPossiblePoints) * 100;

    const emoji = getEmoji(percentage);

    return (
        <>
            <p className='result'>
                <span>{emoji}</span>
                You Scored<strong> {points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)})%
            </p>

            <p className="highscore">(Highscore: {highscore} Points)</p>

            <button className='btn btn-option' onClick={() => dispatch({ type: "restart" })}>Restart Quiz</button>
        </>
    )
}

export default FinishScreen