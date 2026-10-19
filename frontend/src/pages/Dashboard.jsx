import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { deleteTask, getTaskStats, getTasks } from '../services/taskApi';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]); const [stats, setStats] = useState({total:0,todo:0,inProgress:0,completed:0});
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [priority, setPriority] = useState('');
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try { setLoading(true); setError('');
      const [taskRes, statsRes] = await Promise.all([getTasks({ search, status, priority }), getTaskStats()]);
      setTasks(taskRes.data.tasks); setStats(statsRes.data);
    } catch (err) { setError(err.response?.data?.message || 'Could not load tasks.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [search, status, priority]);

  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(id); load(); } catch (err) { setError(err.response?.data?.message || 'Delete failed.'); }
  };

  return <><Navbar /><main className="container">
    <div className="page-heading"><div><h1>Dashboard</h1><p className="muted">Manage your personal tasks.</p></div><button className="button primary" onClick={() => navigate('/tasks/create')}>+ Create Task</button></div>
    {error && <div className="alert error">{error}</div>}
    <section className="stats-grid"><div><strong>{stats.total}</strong><span>Total Tasks</span></div><div><strong>{stats.todo}</strong><span>To Do</span></div><div><strong>{stats.inProgress}</strong><span>In Progress</span></div><div><strong>{stats.completed}</strong><span>Completed</span></div></section>
    <section className="filters"><input placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} /><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All Status</option><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All Priority</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></section>
    {loading ? <div className="empty">Loading tasks...</div> : tasks.length ? <section className="task-grid">{tasks.map(task => <TaskCard key={task._id} task={task} onDelete={remove} />)}</section> : <div className="empty"><h3>No tasks found</h3><p>Create your first task to get started.</p></div>}
  </main></>;
}
