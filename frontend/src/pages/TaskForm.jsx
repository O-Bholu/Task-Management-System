import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createTask, getTask, updateTask } from '../services/taskApi';

const initial = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' };

export default function TaskForm() {
  const { id } = useParams(); const editMode = Boolean(id); const navigate = useNavigate();
  const [form, setForm] = useState(initial); const [loading, setLoading] = useState(editMode); const [saving, setSaving] = useState(false); const [error, setError] = useState('');

  useEffect(() => { if (!editMode) return;
    getTask(id).then(({data}) => setForm({...data.task, dueDate: data.task.dueDate ? new Date(data.task.dueDate).toISOString().slice(0,10) : ''}))
      .catch(err => setError(err.response?.data?.message || 'Could not load task.')).finally(() => setLoading(false));
  }, [id, editMode]);

  const submit = async (e) => { e.preventDefault(); setError(''); setSaving(true);
    try { if (editMode) await updateTask(id, form); else await createTask(form); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Could not save task.'); }
    finally { setSaving(false); }
  };

  if (loading) return <><Navbar /><main className="container"><div className="empty">Loading...</div></main></>;

  return <><Navbar /><main className="container narrow"><div className="page-heading"><div><h1>{editMode ? 'Edit Task' : 'Create Task'}</h1><p className="muted">{editMode ? 'Update your task details.' : 'Add a new task.'}</p></div></div>
    <form className="form-card" onSubmit={submit}>{error && <div className="alert error">{error}</div>}
      <label>Title<input required minLength="2" maxLength="100" value={form.title} onChange={e => setForm({...form,title:e.target.value})} /></label>
      <label>Description<textarea rows="5" value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></label>
      <div className="form-row"><label>Status<select value={form.status} onChange={e => setForm({...form,status:e.target.value})}><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></label><label>Priority<select value={form.priority} onChange={e => setForm({...form,priority:e.target.value})}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label><label>Due Date<input type="date" value={form.dueDate || ''} onChange={e => setForm({...form,dueDate:e.target.value})} /></label></div>
      <div className="form-actions"><button type="button" className="button secondary" onClick={() => navigate('/dashboard')}>Cancel</button><button className="button primary" disabled={saving}>{saving ? 'Saving...' : editMode ? 'Update Task' : 'Create Task'}</button></div>
    </form></main></>;
}
