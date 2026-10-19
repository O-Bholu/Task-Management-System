const express = require('express');
const protect = require('../middleware/authMiddleware');
const { createTask, getTasks, getTask, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');

const router = express.Router();

router.use(protect);
router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
