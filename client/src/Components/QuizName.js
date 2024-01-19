import React, { useState } from 'react'
import styles from './QuizName.module.css'

function QuizName({ onCancel }) {
  const [qna, setQna] = useState(false)
  const [poll, setPoll] = useState(false)
  const handleCancel = () => {
    onCancel()
  }
  const handleQNA = () => {
    setQna(true)
    setPoll(false)
  }
  const handlePoll = () => {
    setPoll(true)
    setQna(false)
  }
  return (
    <>
      <div className={styles.QuizName}>
        <input
          placeholder='Quiz name'
        />
        <div className={styles.QuizType}>
          <label>Quiz type</label>
          <button onClick={handleQNA} className={qna ? styles.selected : ''}>Q&A</button>
          <button onClick={handlePoll} className={poll ? styles.selected : ''}>Poll Type</button>
        </div>
        <div className={styles.btns}>
          <button className={styles.cancel} onClick={handleCancel}>Cancel</button>
          <button className={styles.continue}>Create</button>
        </div>
      </div>
    </ >
  )
}

export default QuizName