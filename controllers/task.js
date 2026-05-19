const Task = require('../model/Task');
const User = require('../model/User');

async function createTask(req, res) {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = new Task({
      title,
      description,
      status: status || 'pending',
      user: userId
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

async function getTasks(req, res) {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ tasks, total: tasks.length });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ tasks, total: tasks.length });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

async function getTask(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findById(id).populate('user', 'name email');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.user._id.toString() !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to access this task' });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.userId;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.user.toString() !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to update this task' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.user.toString() !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this task' });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

module.exports = {
  createTask,
  getTasks,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
};
