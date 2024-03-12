const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRouter = require('./userRouter'); // Corrected require path
const morgan = require('morgan');
const cors = require('cors');



app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', userRouter);




mongoose.connect('mongodb://localhost:27017/userAuth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

app.use('/users', userRouter); // Mounting the userRouter middleware

app.listen(5000, () => {
    console.log('localhost connected successfully');
});
