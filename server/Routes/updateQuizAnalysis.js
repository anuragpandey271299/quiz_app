const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/authMiddleware');
const Quiz = require('../Models/quiz');

router.put('/:quizId/answer-question', isLoggedIn, async (req, res) => {
  try {
    const quizId = req.params.quizId.trim();
    const { questionId, selectedOption } = req.body;

    const quiz = await Quiz.findOne({ quizId });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const question = quiz.questions.find(q => q._id.toString() === questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found in the quiz' });
    }
    question.options[selectedOption].selectedCounts += 1;

    
    if (selectedOption !== null && selectedOption !== undefined) {
      question.attemptedCount = (question.attemptedCount || 0) + 1;
      question.selectedOption = selectedOption;
      if (selectedOption === question.correctOption) {
        question.correctCount = (question.correctCount || 0) + 1;
      } else {
        question.wrongCount = (question.wrongCount || 0) + 1;
      }
    }

    await quiz.save();

    res.json({ message: 'Answer submitted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
