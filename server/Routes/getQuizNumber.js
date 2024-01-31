const express = require('express');
const quiz = require('../Models/quiz');
const isLoggedIn = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/quizStats', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user;
    const userQuizzes = await quiz.find({ userID: userId });
    const totalQuizCount = userQuizzes.length;
    let totalQuestionCount = 0;
    let totalImpressionCount = 0;
    userQuizzes.forEach((userQuiz) => {
      totalQuestionCount += userQuiz.questions.length;
      totalImpressionCount += userQuiz.impressions;
    });
    
    res.json({ totalQuizCount, totalQuestionCount, totalImpressionCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
