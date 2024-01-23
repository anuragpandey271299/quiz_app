const express = require('express')
const router = express.Router()
const isLoggedIn=require('../middleware/authMiddleware')
const quiz=require('../Models/quiz')

router.post('/addquiz',isLoggedIn,async (req, res) => {
    try{
        const userID=req.user._id
        const { quizName, quizType, questions } = req.body;

        const createdQuiz = await quiz.create({
          userID,
          quizName,
          quizType,
          questions,
        });
        res.send(createdQuiz)
    }catch(error){
        console.log(error)
    }
})
module.exports=router