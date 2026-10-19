import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authApi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await registerUser(form);
      localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Create Account</h1><p className="muted">Start managing your tasks.</p>
    {error && <div className="alert error">{error}</div>}
    <label>Name<input required minLength="2" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></label>
    <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></label>
    <label>Password<input type="password" required minLength="6" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></label>
    <button className="button primary full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
    <p className="center">Already have an account? <Link to="/login">Login</Link></p>
  </form></div>;
}
