const express = require('express');
const user = require('../Models/user');

const router = express.Router();

router.post('/signupUser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password required' });
        }

        const addedUser = await user.create({ name, email, password });

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
