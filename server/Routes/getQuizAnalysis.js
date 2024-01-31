const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/authMiddleware');
const Quiz = require('../Models/quiz');

router.get('/:quizId/question-analysis', isLoggedIn, async (req, res) => {
  try {
    const quizId = req.params.quizId.trim();
    const quiz = await Quiz.findOne({ quizId });
    console.log(quiz);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questionAnalysis = quiz.questions.map((question) => {
      const attemptedCount = question.attemptedCount;
      const correctCount = question.correctCount;
      const wrongCount = question.wrongCount;

      return {
        questionText: question.questionText,
        attemptedCount,
        correctCount,
        wrongCount,
      };
    });

    console.log(questionAnalysis);
    res.json(questionAnalysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
