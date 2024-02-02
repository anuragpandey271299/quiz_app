import React, { useState, useEffect } from 'react';
import styles from './EditQuiz.module.css';
import axios from 'axios';

function EditQuiz({ quizId, onClose, onEditSuccess }) {
  const [questions, setQuestions] = useState([]);
  const [correctOptions, setCorrectOptions] = useState([]);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const jwtoken = localStorage.getItem('jwtoken');
        const config = {
          headers: {
            'Authorization': jwtoken,
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.get(`https://quizzieapp-h7ds.onrender.com/getquiz/${quizId}`, config);
        const quizDetails = response.data;

        const correctOptionsFromDB = quizDetails.questions.map(question => question.correctOption);
        setQuestions(quizDetails.questions);
        setCorrectOptions(correctOptionsFromDB);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  const handleSave = async () => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      const config = {
        headers: {
          'Authorization': jwtoken,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(`https://quizzieapp-h7ds.onrender.com/quizzes/${quizId}`, {
        questions,
      }, config);

      console.log(response.data);
      onEditSuccess();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestionChange = (questionIndex, newQuestionText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionText = newQuestionText;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, newOptionText) => {
    const updatedQuestions = [...questions];

    updatedQuestions[questionIndex].options.forEach((option, index) => {
      if (index !== optionIndex) {
        option.selectedCounts = 0;
      }
    });

    updatedQuestions[questionIndex].options[optionIndex].value = newOptionText;
    updatedQuestions[questionIndex].options[optionIndex].selectedCounts = 1;

    setQuestions(updatedQuestions);
  };

  return (
    <div className={styles.editquiz}>
      <h3>Edit Quiz</h3>
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className={styles.questions}>
          <label className={styles.questionLabel}>{`Q ${questionIndex + 1}:`}</label>
          <div className={styles.questionDiv}>
          <input
            className={styles.questionInput}
            type="text"
            value={question.questionText}
            onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
          />
          </div>

          <div className={styles.optionSection}>
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={styles.answers}
                
              >
                <div className={styles.op}>
                  <label>{`Option ${optionIndex + 1}:`}</label>
                  <input
                    className={styles.optionInput}
                    type="text"
                    style={{
                      border:
                        optionIndex === correctOptions[questionIndex]
                          ? '4px solid #3ED700'
                          : '1px solid black',
                    }}
                    value={option.value}
                    onChange={(e) =>
                      handleOptionChange(questionIndex, optionIndex, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.buttons}>
        <button onClick={handleSave} className={styles.saveBtn}>Save</button>
        <button onClick={onClose} className={styles.closeBtn}>Cancel</button>
      </div>
    </div>
  );
}

export default EditQuiz;
