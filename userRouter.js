const router = require('express').Router();
const User = require('./userschema'); // Change variable name to uppercase User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        // Check if email already exists
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json("Email already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user instance
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        res.json(savedUser); // Return the saved user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        var userData = await User.findOne({ email: req.body.email });
        if (!userData) {
            return res.status(400).json("Email does not exist");
        }
        var validPsw = await bcrypt.compare(req.body.password, userData.password);
        if (!validPsw) {
            return res.status(400).json("Password is not valid");
        }
        var userToken = await jwt.sign({ email: userData.email }, 'periyarasiyam');
        res.header('auth', userToken).send(userToken);
    } catch (err) {
        res.status(400).json(err);
    }
});

const validUser = (req, res, next) => {
    var token = req.header('auth');
    req.token = token;
    next();
}

router.get('/getall', validUser, async (req, res) => {
    try {
        jwt.verify(req.token, 'periyarasiyam', async (err, data) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const userData = await User.find();
                res.json(userData);
            }
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
