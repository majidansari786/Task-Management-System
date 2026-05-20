import React from 'react';
import './TaskList.css';
import TaskCard from './TaskCard';

function TaskList({ tasks, onEdit, onDelete }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
