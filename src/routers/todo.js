const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Todo = require('../models/todo')


////////////////////////
// post
////////////////////////

router.post('/todo',auth, async (req, res) => {
    // console.log(req.body)
    const todo = new Todo({ ...req.body, createdBy: req.user._id })
    try {
        await todo.save(
            res.status(200).send(todo)
        )
    }
    catch (e) {
        res.status(400).send('error ' + e)
    }
})

////////////////////////
//get all
////////////////////////

router.get('/todo', auth, async (req, res) => {
    try {
        await req.user.populate('todo').execPopulate()
        res.send(req.user.todo)
    }
    catch (e) {
        res.send(500).send('error ' + e)
    }
})

////////////////////////
//get By Id
////////////////////////

router.get('/todo/:id', auth, async (req, res) => {

    const _id = req.params.id
    try {
        const todo = await Todo.findOne({ _id, createdBy: req.user._id })
        if (!todo) {
            return res.status(404).send('todo Is Not Found')
        }
        res.status(200).send(todo)
    }
    catch (e) {
        res.status(500).send('error ' + e)
    }
})

////////////////////////
//patch
////////////////////////

router.patch('/todo/:id', auth, async (req, res) => {
    const _id = req.params.id
    const update = Object.keys(req.body)
    try {
        const todo = await Todo.findOne({ _id, createdBy: req.user._id })

        // new: true, runValidators: true 

        if (!todo) {
            return res.send('No todo Is Found')
        }
        res.status(200).send(todo)
    }
    catch (e) {
        res.status(400).send('Error ' + e)
    }
})

////////////////////////
//delete
////////////////////////

router.delete('/todo/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const todo = await Todo.findOneAndDelete({ _id, createdBy: req.user._id })
        if (!todo) {
            return res.send('No todo')
        } res.send(todo)
    }
    catch (e) {
        res.send('error ' + e)
    }
})


/////////////////////////////////
// Todo Image
/////////////////////////////////

const uploaded = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            return cb(new Error('Pleas Upload An Image'))
        }
        cb(null, true)
    }
})

router.post('/todo/avatar', auth, upload.single('image'), async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id, createdBy: req.user._id })
        if (!todo) {
            return res.status(400).send('No Todo Is Found')
        }
        news.image = req.file.buffer
        news.save()
        res.send('saved')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})




module.exports = router