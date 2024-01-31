import React, { useState, useEffect } from 'react'
import styles from './QuizPage.module.css'
import Dashboard from '../Components/Dashboard'
import Analytics from '../Components/Analytics'
import QuizName from '../Components/QuizName'
import QuizQuestion from '../Components/QuizQuestion'
import {useNavigate} from 'react-router-dom'

function QuizPage() {
    const [showDashboard, setShowDashboard] = useState(false)
    const [showAnalytics, setShowAnalytics] = useState(false)
    const [showQuizName, setShowQuizName] = useState(false)
    const [isBlur, setIsBlur] = useState(false)
    const [showQuizQuestion, setShowQuizQuestion] = useState(false)
    const [selectedQuizType, setSelectedQuizType] = useState(null);
    const [selectedQuizName, setSelectedQuizName] = useState(null);
    const navigate=useNavigate()

    useEffect(() => {
        handleShowDashboard();
      }, []);

    const handleShowDashboard = () => {
        setShowDashboard(true)
        setShowAnalytics(false)
        setShowQuizName(false)
    }
    const handleShowAnalytics = () => {
        setShowAnalytics(true)
        setShowDashboard(false)
        setShowQuizName(false)
    }
    const handleShowQuizName = () => {
        setShowQuizName(true)
        setShowAnalytics(false)
        setShowDashboard(false)
        setIsBlur(true)
    }
    const handleCancel = () => {
        setShowQuizName(false)
        setIsBlur(false)
        setShowQuizQuestion(false)
    }
    const handleContinue = (quizType, quizName) => {
        setSelectedQuizName(quizName)
        setSelectedQuizType(quizType)
        setShowQuizName(false)
        setShowQuizQuestion(true)
    }
    const handleLogOut=()=>{
        localStorage.clear()
        navigate('/')
    }

    return (
        <>
            <div className={`${styles.quizPage} ${isBlur ? styles.blur : ''}`}>
                <div className={styles.leftPanel}>
                    <h1>Quizzie</h1>
                    <div className={styles.btns}>
                        <button onClick={handleShowDashboard}>Dashboard</button>
                        <button onClick={handleShowAnalytics}>Analytics</button>
                        <button onClick={handleShowQuizName}>Create Quiz</button>
                    </div>
                    <button onClick={handleLogOut} className={styles.logoutBtn}>Log Out</button>
                </div>
                <div className={styles.content}>
                    {showDashboard && <Dashboard />}
                    {showAnalytics && <Analytics />}
                </div>
            </div>
            <div className={styles.modal}>
                {showQuizName && <QuizName onCancel={handleCancel} onContinue={handleContinue} />}
                {showQuizQuestion && <QuizQuestion onCancel={handleCancel} quizType={selectedQuizType} quizName={selectedQuizName}/>}
            </div>
        </>
    )
}

export default QuizPage