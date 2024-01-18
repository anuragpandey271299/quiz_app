const express = require('express');
const bcrypt = require('bcrypt')
const user = require('../Models/user');

const router = express.Router();

router.post('/signupUser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password required' });
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        const addedUser = await user.create({ name, email, password: encryptedPassword });

        if (addedUser) {
            return res.status(201).json(addedUser);
        } else {
            return res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
