const express=require('express')
const quiz=require('../Models/quiz')
const isLoggedIn=require('../middleware/authMiddleware')
const router=express.Router()

router.post('/incrementImpression/:quizId', isLoggedIn, async (req, res) => {
    try {
        const { quizId } = req.body;
        const updatedQuiz = await quiz.findOneAndUpdate(
            { quizId },
            { $inc: { impressions: 1 } },
            { new: true }
        );

        res.status(200).json({ success: true, updatedQuiz });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
