const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const Todo = new mongoose.model('Todo', todoSchema);

// GET ALL TODOS
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({status: 'active'}).select({
            _id: 0,
            __v: 0,
        }).limit(2);
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});

// GET ACTIVE TODOS
router.get('/active', async (req, res) => {
    try {
        const todo = new Todo();
        const data = await todo.findActive();
        if (!data) {
            return res.status(404).json({ error: "No active todos found!" });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});

// STATIC METHODS
router.get('/js', async (req, res) => {
    try {
        const data = await Todo.findByJS();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});

// QUERY HELPERS (GET TODOS BY LANGUAGE)
router.get('/language', async (req, res) => {
    try {
        const data = await Todo.find().byLanguage("1");
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});

// GET A SINGLE TODO BY ID
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found!" });
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});


// CREATE A NEW TODO
router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        const savedTodo = await newTodo.save();
        res.status(200).json({
            message: "Todo was inserted successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});

// CREATE MULTIPLE TODOS
router.post('/all', async (req, res) => {
    try {
        const savedTodos = await Todo.insertMany(req.body);
        res.status(200).json({
            message: "Todos were inserted successfully!",
            data: savedTodos
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});

// UPDATE A TODO
router.put('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );

        res.status(200).json({
            message: "Todo was updated successfully!",
            data: updatedTodo
        });
    } catch (error) {
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});


// DELETE A TODO
router.delete('/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ error: "Todo not found!" });
        }
        res.status(200).json({ message: "Todo deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "There was a server-side error!" });
    }
});


module.exports = router;