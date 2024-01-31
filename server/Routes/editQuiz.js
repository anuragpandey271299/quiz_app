const express = require('express');
const router = express.Router();
const quiz = require('../Models/quiz');

router.put('/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId.trim();
    const { questions } = req.body;

    const quizToUpdate = await quiz.findOneAndUpdate(
      { quizId },
      { questions },
      { new: true }
    );
    console.log(quizToUpdate);

    if (!quizToUpdate) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quizToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
