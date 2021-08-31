const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const TodoSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt:{
        type: Data,
        default: Data.now
    },
    image: {
        type: Buffer
    }
})


const Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo