
const express = require('express');
const quiz = require('../Models/quiz');
const isLoggedIn = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/quizzes', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user;
    const userQuizzes = await quiz.find({ userID: userId });


    const quizzesWithImpressions = await Promise.all(
      userQuizzes.map(async (userQuiz) => {
        const impressions = await getQuizImpressions(userQuiz.quizId);
        return {
          quizId: userQuiz.quizId,
          quizName: userQuiz.quizName,
          impressions: userQuiz.impressions,
          createdAt: userQuiz.createdAt
        };
      })
    );

    res.json(quizzesWithImpressions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getQuizImpressions = async (quizId) => {
  const userQuiz = await quiz.findOne({ quizId });
  return userQuiz.impressions || 0;
};
module.exports = router;
