const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    description: String,
    alternatives: [
        {
            text: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ],
    test: [{
        type: String,
        ref: 'Test',
        required: true
    }]
})



module.exports = mongoose.model('Question', QuestionSchema)