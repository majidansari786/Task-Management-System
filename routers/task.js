const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const authMiddleware = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(authMiddleware);

// Create task
router.post('/', taskController.createTask);

// Get user's tasks
router.get('/', taskController.getTasks);

// Get single task
router.get('/:id', taskController.getTask);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

// Admin: Get all tasks
router.get('/admin/all', rbac(['ADMIN']), taskController.getAllTasks);

module.exports = router;
