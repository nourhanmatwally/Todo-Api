const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middleweare/auth')
const multer = require('multer')


///////////////////////////////////
// Post //Done//
///////////////////////////////////

router.post('/user', async (req, res) => {
    const userIn = new User(req.body)
    try {
        await userIn.save()
        const token = await userIn.generateToken()
        res.status(200).send({ userIn, token })
    }
    catch (e) {
        res.status(400).send('error ' + e)
    }
})

///////////////////////////////////
// Get All //Done//
///////////////////////////////////

router.get('/user', auth, (req, res) => {
    User.find({}).then((user) => {
        res.status(200).send(user)
    }).catch((e) => {
        res.status(500).send('Error ' + e)
    })
})


///////////////////////////////////
// Get By Id //Done//
///////////////////////////////////

router.get('/user/:id', auth, (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('Unable To Find User')
        }
        res.status(200).send(user)
    }).catch((e) => {
        res.status(500).send('Unable To Find User')
    })
})


///////////////////////////////////
// Patch / Update //Done//
///////////////////////////////////

router.patch('/user/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.send('No User Is Found')
        }
        res.status(200).send(user)
    }
    catch (e) {
        res.status(400).send('Error Has Occured ' + e)
    }
})


///////////////////////////////////
// Delete  //Done//
///////////////////////////////////

router.delete('/user/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.send('No User Is Found')
        }
        res.send(user)
    }
    catch (e) {
        res.send('Error ' + e)
    }
})


///////////////////////////////////
// LogIn //Done//
///////////////////////////////////

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    }
    catch (e) {
        res.send('Try Again ' + e)
    }
})

///////////////////////////////////
// LogOut //Done//
///////////////////////////////////

router.delete('/logout', auth, async (req, res) => {
    try {
        req.user.token = req.user.tokens.filter((el) => {
            return el.token !== req.token
        })
        await req.user.save()
        res.send('LogOut Success')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})

///////////////////////////////////
// LogOut All //Done//
///////////////////////////////////

router.delete('logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('LogoutAll Is Run Success')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})

///////////////////////////////////
// Profile Image //Done//
///////////////////////////////////

const upload = multer({
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

router.post('/profile/avatar', auth, upload.single('image'), async (req, res) => {
    try {
        req.user.avatar = req.file.buffer
        await req.user.save()
        res.send('Image Uploaded')
    }
    catch (e) {
        res.send('Error ' + e)
    }
})


module.exports = router