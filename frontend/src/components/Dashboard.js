import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const API_URL = 'http://localhost:5000/api/v1';

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      setTasks([response.data.task, ...tasks]);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
      setTasks(tasks.map(t => t._id === taskId ? response.data.task : t));
      setEditingTask(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/tasks/${taskId}`);
        setTasks(tasks.filter(t => t._id !== taskId));
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete task');
      }
    }
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Task Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-controls">
          <button 
            className="btn-create"
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>

          <div className="filter-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <TaskForm 
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask._id, data) : 
              handleCreateTask
            }
            initialTask={editingTask}
            isEditing={!!editingTask}
          />
        )}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <TaskList 
            tasks={filteredTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowForm(true);
            }}
            onDelete={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
