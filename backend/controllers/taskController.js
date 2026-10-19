const mongoose = require('mongoose');
const Task = require('../models/Task');

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      dueDate: dueDate || null,
      userId: req.user._id
    });

    res.status(201).json({ message: 'Task created successfully.', task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority } = req.query;
    const filter = { userId: req.user._id };

    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    if (['TODO', 'IN_PROGRESS', 'COMPLETED'].includes(status)) filter.status = status;
    if (['LOW', 'MEDIUM', 'HIGH'].includes(priority)) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.title !== undefined) {
      if (!String(updates.title).trim()) return res.status(400).json({ message: 'Task title cannot be empty.' });
      updates.title = String(updates.title).trim();
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task updated successfully.', task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getTaskStats = async (req, res, next) => {
  try {
    const [total, todo, inProgress, completed] = await Promise.all([
      Task.countDocuments({ userId: req.user._id }),
      Task.countDocuments({ userId: req.user._id, status: 'TODO' }),
      Task.countDocuments({ userId: req.user._id, status: 'IN_PROGRESS' }),
      Task.countDocuments({ userId: req.user._id, status: 'COMPLETED' })
    ]);

    res.json({ total, todo, inProgress, completed });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, getTaskStats };
