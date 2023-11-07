import React from 'react'

const Questions = ({ question }) => {
    console.log(question);
    return (
        <div>
            <h4>{question.question}</h4>
   
        </div>
    )
}

export default Questions