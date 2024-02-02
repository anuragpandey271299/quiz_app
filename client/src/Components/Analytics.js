import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Analytics.module.css';
import deleteIMG from './images/deleteIMG.png';
import editIMG from './images/editIMG.png';
import shareIMG from './images/shareIMG.png'
import EditQuiz from './EditQuiz';
import QuizAnalysis from './QuizAnalysis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Analytics() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [quizAnalysisId, setQuizAnalysisId] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);

  const fetchQuizData = async () => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      const config = {
        headers: {
          'Authorization': jwtoken,
          'Content-Type': 'application/json',
        },
      };

      const quizzesData = await axios.get('https://quizzieapp-h7ds.onrender.com/quizzes', config);
      console.log(quizzesData.data);
      setQuizzes(quizzesData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [editingQuizId]);

  const handleEditClick = (quizId) => {
    setEditingQuizId(quizId);
  };

  const handleEditSuccess = () => {
    setEditingQuizId(null);
    fetchQuizData();
  };

  const handleShareClick = (quizLink) => {
    navigator.clipboard.writeText(quizLink);
    toast.success('Link copied to clipboard!');
  };

  const handleQuizAnalysisClick = (quizId) => {
    setQuizAnalysisId(quizId);
  };

  const closeQuizAnalysis = () => {
    setQuizAnalysisId(null);
  };

  const handleDeleteClick = async (quizId) => {
    setDeleteConfirmationId(quizId);
    setIsDeleteConfirmationVisible(true);
  }
  const confirmDelete = async () => {
    try {
      const jwtoken = localStorage.getItem('jwtoken');
      const config = {
        headers: {
          'Authorization': jwtoken,
          'Content-Type': 'application/json',
        },
      };

      await axios.delete(`https://quizzieapp-h7ds.onrender.com/quizzes/${deleteConfirmationId}`, config);
      setDeleteConfirmationId(null);
      fetchQuizData();
    } catch (error) {
      console.log(error);
    }
    setDeleteConfirmationId(null);
    setIsDeleteConfirmationVisible(false);
  }

  const cancelDelete = () => {
    setDeleteConfirmationId(null);
    setIsDeleteConfirmationVisible(false);
  };

  return (
    <div className={styles.analyticsContainer}>
      {isLoading ? (
        <h1 id={styles.loading}>LOADING...</h1>
      ) : (
        <div className={styles.analyticsHead}>
          {editingQuizId ? (
            <EditQuiz
              quizId={editingQuizId}
              onClose={() => setEditingQuizId(null)}
              onEditSuccess={handleEditSuccess}
            />
          ) : (
            <React.Fragment>
              {quizAnalysisId && (
                <QuizAnalysis quizId={quizAnalysisId} onClose={closeQuizAnalysis} />
              )}
              {!quizAnalysisId && (
                <>
                  <h3 id={styles.quizHeading}>Quiz Analysis</h3>
                  <table className={styles.quizTable}>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Quiz Name</th>
                        <th>Created At</th>
                        <th>Impressions</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((quiz, index) => (
                        <tr key={quiz.quizId}>
                          <td>{index + 1}</td>
                          <td>{quiz.quizName}</td>
                          <td>{new Date(quiz.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td>{quiz.impressions}</td>
                          <td>
                            <img
                              src={editIMG}
                              alt='editIMG'
                              onClick={() => handleEditClick(quiz.quizId)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td>
                            <img
                              src={deleteIMG}
                              onClick={() => handleDeleteClick(quiz.quizId)}
                              style={{ cursor: 'pointer' }}
                              alt='deleteIMG'
                            />
                          </td>
                          <td>
                            <img
                              src={shareIMG}
                              alt='shareIMG'
                              onClick={() => handleShareClick(`http://localhost:3000/play-quiz/${quiz.quizId}`)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td>
                            <p onClick={() => handleQuizAnalysisClick(quiz.quizId)} style={{ cursor: 'pointer' }}>Question Wise Analysis</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </React.Fragment>
          )}
        </div>
      )}
      {isDeleteConfirmationVisible && (
        <div className={styles.backdrop}>
          <div className={styles.deleteConfirmation}>
            <p>Are you sure you want to delete?</p>
            <div className={styles.btns}>
            <button onClick={confirmDelete} className={styles.deleteBtn}>Delete</button>
            <button onClick={cancelDelete} className={styles.cancelDeleteBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
