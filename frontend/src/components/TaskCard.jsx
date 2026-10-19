import { useNavigate } from 'react-router-dom';

const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };

export default function TaskCard({ task, onDelete }) {
  const navigate = useNavigate();

  return (
    <article className="task-card">
      <div className="task-card-top">
        <h3>{task.title}</h3>
        <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      <p>{task.description || 'No description provided.'}</p>
      <div className="task-meta">
        <span className={`badge status-${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span>
        <span>{task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}</span>
      </div>
      <div className="task-actions">
        <button className="button secondary" onClick={() => navigate(`/tasks/${task._id}/edit`)}>Edit</button>
        <button className="button danger" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </article>
  );
}
