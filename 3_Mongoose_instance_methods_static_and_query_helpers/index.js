const express = require('express');
const mongoose = require("mongoose");
const todoHandler = require('./routeHandler/todoHandler');

// express app initialization
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose.connect('mongodb://localhost/todos')
.then(() => console.log('connection successful'))
.catch((err) => console.log(err))

// application routes
app.use('/todo', todoHandler);

// default error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error : err });
});

app.listen(3000, () => {
    console.log('App listening on port 3000...');
});