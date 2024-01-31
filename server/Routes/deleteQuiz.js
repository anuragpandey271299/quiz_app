const express = require('express');
const isLoggedIn=require('../middleware/authMiddleware')
const router = express.Router();
const Quiz = require('../Models/quiz');


router.delete('/:quizId',isLoggedIn, async (req, res) => {
  try {
    const quizId = req.params.quizId.trim();

    const result = await Quiz.findOneAndDelete({ quizId });

    if (!result) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
