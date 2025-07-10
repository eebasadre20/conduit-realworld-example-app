const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todo');

// Get all todos
router.get('/', getTodos);

// Create a new todo
router.post('/', createTodo);

// Update a todo by ID
router.put('/:id', updateTodo);

// Delete a todo by ID
router.delete('/:id', deleteTodo);

module.exports = router;