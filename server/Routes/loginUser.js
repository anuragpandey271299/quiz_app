const express = require('express')
const bcrypt = require('bcrypt')
const user = require('../Models/user')
const jwt=require('jsonwebtoken')

const router = express.Router()

router.post('/loginuser', async (req, res) => {
    try {
        const { email, password } = req.body
        const newUser = await user.findOne({ email })
        if (newUser) {
            const checkPassword = await bcrypt.compare(password, newUser.password)
            if (checkPassword) {
                const jwtoken=jwt.sign(newUser.toJSON(),process.env.jwt_secret_key,{expiresIn:20*2000})
                res.status(200).json({'addUser':newUser, 'jwt':jwtoken})
            } else {
                res.status(401).send('Invalid password')
            }
        } else {
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router