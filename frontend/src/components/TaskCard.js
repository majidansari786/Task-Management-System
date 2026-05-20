import React from 'react';
import './TaskCard.css';

function TaskCard({ task, onEdit, onDelete }) {
  const statusColors = {
    pending: '#ffc107',
    in_progress: '#2196f3',
    completed: '#4caf50'
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span 
          className="status-badge" 
          style={{ backgroundColor: statusColors[task.status] }}
        >
          {statusLabels[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <small>Created: {formatDate(task.createdAt)}</small>
      </div>

      <div className="task-actions">
        <button 
          className="btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          Edit
        </button>
        <button 
          className="btn-delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
