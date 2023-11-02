const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const Question = require('./models/Question') // includes our model
const Subject = require('./models/Subject')
const Test = require('./models/Test')

const baseRoute = '/api/v1';

// get all quiz questions
router.get(`${baseRoute}/questions`, async (req, res) => {
    try {
        const questions = await Question.find()
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// get one quiz question
router.get(`${baseRoute}/questions/:id`, async (req, res) => {
    try {
        const _id = req.params.id 

        const question = await (await Question.findOne({_id})).populate("subjects").execPopulate()       
        if(!question){
            return res.status(404).json({})
        }else{
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// create one quiz question
router.post(`${baseRoute}/questions`, async (req, res) => {
    try {

        const { description } = req.body
        const { alternatives } = req.body
        const { test } = req.body

        const question = await Question.create({
            description,
            alternatives,
            test
        })

        const { description, alternatives } = req.body;

        const question = await Question.create({
            description,
            alternatives
        });

        return res.status(201).json({ message: 'Question created successfully', question });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// update one quiz question
router.put(`${baseRoute}/questions/:id`, async (req, res) => {
    try {
        const _id = req.params.id;
        const { description, alternatives, subjects } = req.body;

        let question = await Question.findOne({ _id });

        if (!question) {
            question = await Question.create({
                description,
                alternatives,
                subjects
            });
            return res.status(201).json({ message: 'Question created successfully', question });
        } else {
            // updates only the given fields
            if (description) {
                question.description = description;
            }
            if (alternatives) {
                question.alternatives = alternatives;
            }
            if (subjects) {
                question.subjects = subjects.map((subject) => mongoose.Types.ObjectId(subject));
            }
            await question.save();
            return res.status(200).json({ message: 'Question updated successfully', question });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// delete one quiz question
router.delete(`${baseRoute}/questions/:id`, async (req, res) => {
    try {
        const questionId = req.params.id;

        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        return res.status(200).json({ message: 'Question deleted successfully', deletedQuestion });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//creates a new subject
router.post(`${baseRoute}/subject`, async (req, res) => {
    try {
        const {name} = req.body;
        const subject = await Subject.create({name})
        return res.status(200).json(subject)    
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//get all subjects
router.get(`${baseRoute}/subject`, async (req, res) => {
    try {
        const subjects = await Subject.find()
        return res.status(200).json(subjects)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

//get all questions from a specific subject
router.get(`${baseRoute}/question/subject/:id`, async (req, res) => {
    try {
        const _id = req.params.id 

        const questions = await Question.find({ subjects: _id });
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({"error":error})
    }
})

// Create one test
router.post(`${baseRoute}/tests`, async (req, res) => {
    try {
        const { title, description, passcode } = req.body;

        // Create a new test without specifying questions
        const test = await Test.create({
            title,
            description,
            passcode
        })

        return res.status(201).json(test);
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})


// Get a test with passcode and list of question IDs
router.get(`${baseRoute}/tests/:passcode`, async (req, res) => {
    try {
        const passcode = req.params.passcode;

        // Find the test by the provided passcode
        const test = await Test.findOne({ passcode });

        if (!test) {
            return res.status(404).json({ "error": "Test not found" });
        }

        // Find all questions associated with the test
        const questions = await Question.find({ test: test.title });

        // Return the test information and list of question IDs
        return res.status(200).json({
            test,
            questionIds: questions.map(question => question._id),
        });
    } catch (error) {
        return res.status(500).json({ "error": error });
    }
});

module.exports = router