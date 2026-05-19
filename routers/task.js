const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const authMiddleware = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.get('/admin/all', rbac(['ADMIN']), taskController.getAllTasks);

module.exports = router;
