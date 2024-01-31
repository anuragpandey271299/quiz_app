import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import eyeIMG from '../Components/images/eyeIMG.png'

function Dashboard() {
  const [totalQuiz, setTotalQuiz] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [totalImpression, setTotalImpression] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };

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
        const response = await axios.get('http://localhost:5000/quizStats', config);
        console.log(response.data);
        setTotalQuiz(response.data.totalQuizCount);
        setTotalQuestions(response.data.totalQuestionCount);
        setTotalImpression(response.data.totalImpressionCount);

        const quizzesData = await axios.get('http://localhost:5000/quizzes', config);
        console.log(quizzesData.data);
        setQuizzes(quizzesData.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {isLoading ? (
        <h1 id={styles.loading}>LOADING...</h1>
      ) : (
        <div className={styles.dashboard}>
          <div className={styles.dashboardHead}>
            <div className={styles.quizstates}>
            <div className={styles.quizNumber}>
              <h1>{totalQuiz}</h1> <br /> <h1>Quizzes created</h1>
            </div>
            <div className={styles.questionNumber}>
              <h1>{totalQuestions}</h1> <br /> <h1>Questions created</h1>
            </div>
            <div className={styles.impressionNumber}>
              <h1>{totalImpression}</h1> <br /> <h1> Total impressions</h1>
            </div>
            </div>

            <div className={styles.trendingHead}>
            <h3>Trending Quiz</h3>
            {quizzes.length==0?(
              <p style={{marginLeft:'10px',color:'red',fontSize:'20px'}}>You haven't created any Quiz, Click on Create Quiz to create your first Quiz</p>
            ):(
              <div className={styles.trending}>
              {quizzes.map((quiz) => (
                <div key={quiz.quizId} className={styles.quizNameDiv}>
                  <div className={styles.quizInfo}>
                    <p>{quiz.quizName}</p>
                    <div className={styles.impression}>
                      <p>{quiz.impressions}</p>
                      <img src={eyeIMG} alt='eyeIMG' />
                    </div>
                  </div>
                  <p id={styles.quizDate}>Created at: {new Date(quiz.createdAt).toLocaleDateString(undefined, options)}</p>
                </div>
              ))}
            </div>
            )}

          </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;
