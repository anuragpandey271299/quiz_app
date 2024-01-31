const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    quizId:{type:String},
    quizName:{type:String},
    quizType:{type:String},
    impressions:{type:Number,default:0},
    createdAt:{type:Date,default:Date.now},
    questions: [{
        questionText: { type: String },
        options: [{
            value: { type: String },
            imageValue: { type: String },
            text: { type: String, enum: ['text', 'image'] },
            selectedCounts: { type: Number, default: 0 },
        }],
        correctOption: { type: Number },
        type: { type: String, enum: ['text', 'image', 'textImage'] },
        timer: { type: String, enum: ['off', '5s', '10s'] },
        attemptedCount: { type: Number, default: 0 },
        correctCount: { type: Number, default: 0 },
        wrongCount: { type: Number, default: 0 },
    }]
})

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz