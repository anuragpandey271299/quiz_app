import React, { useEffect, useState, useCallback } from 'react';
import styles from './PlayQuiz.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PlayQuiz() {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allCorrectOptions, setAllCorrectOptions] = useState([]);
  const [selectedOptionCounts, setSelectedOptionCounts] = useState([]);
  const [additionalData, setAdditionalData] = useState(null);
  const [quizType, setQuizType] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const incrementImpression = async () => {
      try {
        const jwtoken = localStorage.getItem('jwtoken');
        const config = {
          headers: {
            'Authorization': jwtoken,
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.post(`https://quizzieapp-h7ds.onrender.com/incrementImpression/${quizId}`, { quizId }, config);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    incrementImpression();
  }, [quizId]);

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
        const response = await axios.get(`https://quizzieapp-h7ds.onrender.com/getquiz/${quizId}`, config);

        console.log(response.data);
        setQuizData(response.data);

        if (response.data?.questions && response.data.questions.length > 0) {
          setCurrentQuestionIndex(0);
          setRemainingTime(response.data.questions[0].timer);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
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
        console.log(additionalDataResponse.data);
        setAdditionalData(additionalDataResponse.data);
        setQuizType(additionalDataResponse.data.quizType);

        const initialCounts = additionalDataResponse.data.questions.map(question =>
          question.options.map(() => ({ selectedCounts: 0 }))
        );
        setSelectedOptionCounts(initialCounts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdditionalData();
  }, [quizId]);

  const checkCorrectness = useCallback((correctOption) => {
    return selectedOption === correctOption;
  }, [selectedOption]);

  const submitAnswer = async () => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      const config = {
        headers: {
          'Authorization': jwtoken,
          'Content-Type': 'application/json',
        },
      };

      const newResponse = await axios.put(`https://quizzieapp-h7ds.onrender.com/quizzes/${quizId}/answer-question`, {
        questionId: quizData.questions[currentQuestionIndex]._id,
        selectedOption,
      }, config);
      console.log(newResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextQuestion = useCallback(() => {
    if (!quizData || !quizData.questions) {
      return;
    }

    const currentQuestionData = quizData.questions[currentQuestionIndex];

    if (!currentQuestionData) {
      return;
    }

    const isCorrect = checkCorrectness(currentQuestionData.correctOption);

    console.log(`Question ${currentQuestionIndex + 1} is ${isCorrect ? 'CORRECT' : 'incorrect'}`);

    if (selectedOption !== null) {
      selectedOptions.push(selectedOption);
    }

    if (isCorrect) {
      console.log('hel');
      allCorrectOptions.push(currentQuestionData.correctOption);
    }

    console.log('Selected Options:', selectedOptions);
    console.log('Correct Options:', allCorrectOptions);

    submitAnswer();
    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setIsLastQuestion(currentQuestionIndex + 1 === quizData.questions.length - 1);
    } else {
      navigate('/quizcompleted', {
        state: {
          correctOptionsCount: allCorrectOptions.length,
          totalQuestions: quizData.questions.length,
          selectedOptions,
          allCorrectOptions,
          quizType: quizData.quizType,
        },
      });
    }
  }, [currentQuestionIndex, quizData, navigate, checkCorrectness, selectedOptions, allCorrectOptions, selectedOption]);

  useEffect(() => {
    if (!quizData || !quizData.questions) {
      return;
    }

    if (quizData.questions[currentQuestionIndex].timer !== 'off') {
      setRemainingTime(parseInt(quizData.questions[currentQuestionIndex].timer));
    } else {
      setRemainingTime(null);
    }
  }, [quizData, currentQuestionIndex]);

  useEffect(() => {
    let interval;

    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setRemainingTime(-1);
      handleNextQuestion();
    }

    return () => clearInterval(interval);
  }, [remainingTime, handleNextQuestion]);

  const handleOptionSelect = (optionIndex) => {
    const updatedCounts = [...selectedOptionCounts];
    updatedCounts[currentQuestionIndex][optionIndex].selectedCounts += 1;
    setSelectedOptionCounts(updatedCounts);
    setSelectedOption(optionIndex);
  };

  useEffect(() => {
    console.log('Selected Option:', selectedOption);
  }, [selectedOption]);

  return (
    <div className={styles.playquiz}>
      {!loading && quizData && quizData.questions && quizData.questions.length > 0 && (
        <div className={styles.quizdiv}>
          <div className={styles.questionNumber}>
            <h2 id={styles.qnum}>{`${currentQuestionIndex + 1}/${quizData.questions.length}`}</h2>
            {remainingTime !== null && remainingTime !== 'off' && (
              <div className={styles.timer}>
                <p>00:{remainingTime}s</p>
              </div>
            )}
          </div>
          <div>
            <h1>{quizData.questions[currentQuestionIndex].questionText}</h1>
          </div>
          <div className={styles.topOption}>
            {quizData.questions[currentQuestionIndex].type === 'image' ? (
              quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <img
                  key={optionIndex}
                  onClick={() => handleOptionSelect(optionIndex)}
                  src={option.imageValue}
                  alt={`Quiz Option ${optionIndex + 1}`}
                  className={selectedOption === optionIndex ? styles.selected : ''}
                />
              ))
            ) : quizData.questions[currentQuestionIndex].type === 'textImage' ? (
              quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  onClick={() => handleOptionSelect(optionIndex)}
                  className={`${styles.imgtxt} ${selectedOption === optionIndex ? styles.selected : ''}`}
                >
                  <p>{option.value}</p>
                  <img src={option.imageValue} alt={`Quiz Option ${optionIndex + 1}`} />
                </div>
              ))
            ) : (
              quizData.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <p
                  key={optionIndex}
                  onClick={() => handleOptionSelect(optionIndex)}
                  className={selectedOption === optionIndex ? styles.selected : ''}
                >
                  {option.value}
                </p>
              ))
            )}
          </div>
          <div className={styles.nextBtn}>
            <button onClick={handleNextQuestion}>{isLastQuestion ? 'Submit' : 'Next'}</button>
          </div>
        </div>
      )}
      {!loading && (!quizData || quizData.questions.length === 0) && <p>No quiz data available.</p>}
    </div>
  );
}

export default PlayQuiz;
