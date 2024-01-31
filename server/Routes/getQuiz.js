const express=require('express')
const quiz=require('../Models/quiz')
const isLoggedIn=require('../middleware/authMiddleware')

const router=express.Router()

router.get('/getquiz/:quizId',isLoggedIn, async (req, res) => {
    try {
        const userid=req.user
        const quizId = req.params.quizId;
        const quizD = await quiz.findOne({ userID:userid,quizId });
        if (!quizD) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quizD);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports=router