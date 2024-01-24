import React, { useState } from 'react';
import styles from './QuizName.module.css';
import QuizQuestion from './QuizQuestion';

function QuizName({ onCancel, onContinue }) {
  const [quizName, setQuizName]=useState('')
  const [qna, setQna] = useState(false);
  const [poll, setPoll] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);
  const [quizType, setQuizType] = useState(null);

  const handleCancel = () => {
    onCancel();
  };

  const handleQNA = () => {
    setQna(true);
    setPoll(false);
    setQuizType('Q&A');
  };

  const handlePoll = () => {
    setPoll(true);
    setQna(false);
    setQuizType('Poll');
  };

  const handleContinue = () => {
    if(!quizName){
      alert('Enter quiz name')
      return
    }
    if(!quizType){
      alert('select quiz type')
      return
    }
    setContinueClicked(true);
    onContinue(qna ? 'Q&A' : 'Poll',quizName);

  };

  return (
    <>
      <div className={styles.QuizName}>
        <input
        placeholder='Quiz name'
        value={quizName}
        onChange={(e)=>setQuizName(e.target.value)}
        />
        <div className={styles.QuizType}>
          <label>Quiz type</label>
          <button onClick={handleQNA} className={qna ? styles.selected : ''}>
            Q&A
          </button>
          <button onClick={handlePoll} className={poll ? styles.selected : ''}>
            Poll Type
          </button>
        </div>
        <div className={styles.btns}>
          <button className={styles.cancel} onClick={handleCancel}>
            Cancel
          </button>
          <button onClick={handleContinue} className={styles.continue}>
            Continue
          </button>
        </div>
      </div>

      {continueClicked && quizType && (
        <QuizQuestion onCancel={onCancel} quizType={quizType} quizName={quizName} />
      )}
    </>
  );
}

export default QuizName;
