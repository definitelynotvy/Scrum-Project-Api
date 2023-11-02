const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    passcode: {
        type: String,
        required: true
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ]
});

module.exports = mongoose.model('Test', TestSchema);