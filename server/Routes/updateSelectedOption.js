const express = require('express');
const router = express.Router();
const Quiz = require('../Models/quiz');

router.post('/update-selected-option/:quizId', async (req, res) => {
    const { quizId } = req.params;
    const { questions } = req.body;
  
    try {
      const quiz = await Quiz.findOne({ quizId });
  
      questions.forEach((question, questionIndex) => {
        question.options.forEach((option, optionIndex) => {
          quiz.questions[questionIndex].options[optionIndex].selectedCounts = option.selectedCounts;
        });
      });
  
      await quiz.save();
  
      res.status(200).json({ message: 'Quiz data updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
