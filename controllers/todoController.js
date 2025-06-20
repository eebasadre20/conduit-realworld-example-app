const Todo = require('../models/todo');

exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo item' });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todo items' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.update({ title, description, status });
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: 'Todo item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo item' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.destroy();
      res.status(200).json({ message: 'Todo item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Todo item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo item' });
  }
};
