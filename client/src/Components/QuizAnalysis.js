import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './QuizAnalysis.module.css';

function QuizAnalysis({ quizId, onClose }) {
    const [quizData, setQuizData] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [quizType, setQuizType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [additionData, setAdditionalData] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const jwtoken = localStorage.getItem('jwtoken');
                const config = {
                    headers: {
                        'Authorization': jwtoken,
                        'Content-Type': 'application/json',
                    },
                };

                const quizzesResponse = await axios.get('https://quizzieapp-h7ds.onrender.com/quizzes', config);
                setAllQuizzes(quizzesResponse.data);

                const selectedQuiz = quizzesResponse.data.find(quiz => quiz.quizId === quizId);
                setQuizData(selectedQuiz);

                const analysisResponse = await axios.get(`https://quizzieapp-h7ds.onrender.com/quizzes/${quizId}/question-analysis`, config);
                setAnalysisData(analysisResponse.data);

                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false); 
            }
        };

        fetchQuizData();
    }, [quizId]);

    useEffect(() => {
        const fetchAdditionalData = async () => {
            try {
                const jwtoken = localStorage.getItem('jwtoken');
                const config = {
                    headers: {
                        'Authorization': jwtoken,
                        'Content-Type': 'application/json',
                    },
                };

                
                const additionalDataResponse = await axios.get(`https://quizzieapp-h7ds.onrender.com/getquiz/${quizId}`, config);
                setAdditionalData(additionalDataResponse.data);
                setQuizType(additionalDataResponse.data.quizType);
                
            } catch (error) {
                console.log(error);
            }
        };

        fetchAdditionalData();
    }, []);

    useEffect(() => {
        console.log(additionData);
        console.log(quizType);
    }, [quizType]); 

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.quizAnalysisContainer}>
            {quizData && (
                <div className={styles.quizInfo}>
                    <h3>Quiz {allQuizzes.findIndex(q => q.quizId === quizData.quizId) + 1} Analysis</h3>
                    <p>Created At: {new Date(quizData.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p><br />
                    <p>Impressions: {quizData.impressions}</p>
                </div>
            )}
            {analysisData ? (
                <div>
                    {analysisData.map((questionData, index) => (
                        <div className={styles.allquestions} key={index}>
                            <p id={styles.questionText}>{`Q${index + 1} ${questionData.questionText}:`}</p>
                            {quizType !== 'Poll' ? (
                                <div className={styles.questionStats}>
                                    <div className={styles.questionStatsData}>
                                        <p>{questionData.attemptedCount}</p>
                                        <p>people Attempted the question</p>
                                    </div>
                                    <div className={styles.questionStatsData}>
                                        <p>{questionData.correctCount}</p>
                                        <p>people Answered Correctly</p>
                                    </div>
                                    <div className={styles.questionStatsData}>
                                        <p>{questionData.wrongCount}</p>
                                        <p>people Answered Incorrectly</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.questionStats}>
                                    {additionData.questions[index].options.map((option, optionIndex) => (
                                        <div key={option._id} className={styles.questionStatsData} >
                                            <p>{option.selectedCounts}</p><h6>Option {optionIndex+1}</h6>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <hr />
                        </div>
                    ))}
                    <button onClick={onClose}>Close</button>
                </div>
            ) : (
                <p>No analysis data available.</p>
            )}


        </div>
    );
}

export default QuizAnalysis;
