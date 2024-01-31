import React from 'react';
import styles from './QuizCompleted.module.css';
import trophy from '../Components/images/trophy.png';
import { useLocation } from 'react-router-dom';

function QuizCompleted() {
    const location = useLocation();
    const { correctOptionsCount, totalQuestions } = location.state;
    const { quizType } = location.state; 
    console.log(quizType)

    return (
        <div className={styles.quizcompleted}>
            {quizType === 'Q&A' ? (
                <>
                    <h1>Congrats Quiz is completed</h1>
                    <img src={trophy} alt='trophy' />
                    <h1>Your Score is <span>0{correctOptionsCount}/0{totalQuestions}</span></h1>
                </>
            ) : (
                <h1>Thanks for participating in the poll</h1>
            )}
        </div>
    );
}

export default QuizCompleted;
