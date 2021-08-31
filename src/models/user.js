const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true
    },
    age: {
        type: Number,
        default: 23,
        validator(value) {
            if (value < 0) {
                throw new Error('Age Must Be A Positive Number')
            }
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Wrong Email')
            }
        }
    },
    password: {
        type: String,
        require: true,
        tirm: true,
        minLength: 6
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
})

///////////////////
// Hash password
///////////////////

userSchema.pre('save', async function (next) {
    const user = this
    console.log(user);
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

///////////////////////////
// Token
///////////////////////////

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'Todo-Manger')
    user.tokens = user.tokens.concat({ token: token})
    await user.save()
    return token
}

////////////////////////////
// Login
////////////////////////////

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    console.log(user)
    if (!user) {
        throw new Error('Unable To Login. Plz Check Email Or Password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable To Login. Plz Check Email Or Password')
    }
    return user
}

// ////////////////////////
// // Relation
// ////////////////////////

// userSchema.virtual('todo',{
//     ref:'Todo',
//     localField:'_id',
//     foreignField:'owner'
// })

const User = mongoose.model('User', userSchema)
module.exports = User