const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    quizName:{type:String},
    quizType:{type:String},
    questions: [{
        questionText: { type: String },
        options: [{
            value: { type: String },
            imageValue: { type: String },
            text: { type: String, enum: ['text', 'image'] }
        }],
        correctOption: { type: Number },
        type: { type: String, enum: ['text', 'image', 'textImage'] },
        timer: { type: String, enum: ['off', '5s', '10s'] },
    }]
})

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz