const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const authMiddleware = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { validateInput, validateParams, schemas } = require('../middleware/validation');

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Complete Project" }
 *               description: { type: string, example: "Finish the assignment" }
 *               status: { type: string, enum: [pending, in_progress, completed] }
 *     responses:
 *       201: { description: "Task created successfully" }
 *       400: { description: "Validation error" }
 *       401: { description: "Unauthorized" }
 */
router.post('/', validateInput(schemas.createTask), taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get user's tasks
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: "Tasks retrieved successfully" }
 *       401: { description: "Unauthorized" }
 */
router.get('/', taskController.getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "Task retrieved successfully" }
 *       404: { description: "Task not found" }
 *       401: { description: "Unauthorized" }
 */
router.get('/:id', validateParams(schemas.taskId), taskController.getTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [pending, in_progress, completed] }
 *     responses:
 *       200: { description: "Task updated successfully" }
 *       404: { description: "Task not found" }
 *       401: { description: "Unauthorized" }
 */
router.put('/:id', validateParams(schemas.taskId), validateInput(schemas.updateTask), taskController.updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "Task deleted successfully" }
 *       404: { description: "Task not found" }
 *       401: { description: "Unauthorized" }
 */
router.delete('/:id', validateParams(schemas.taskId), taskController.deleteTask);

/**
 * @swagger
 * /api/v1/tasks/admin/all:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Tasks - Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: "All tasks retrieved successfully" }
 *       403: { description: "Forbidden - Admin access required" }
 *       401: { description: "Unauthorized" }
 */
router.get('/admin/all', rbac(['ADMIN']), taskController.getAllTasks);

module.exports = router;
