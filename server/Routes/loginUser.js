const express = require('express')
const bcrypt = require('bcrypt')
const user = require('../Models/user')

const router = express.Router()

router.post('/loginuser', async (req, res) => {
    try {
        const { email, password } = req.body
        const newUser = await user.findOne({ email })
        if (newUser) {
            const checkPassword = await bcrypt.compare(password, newUser.password)
            if (checkPassword) {
                res.status(200).send(newUser)
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