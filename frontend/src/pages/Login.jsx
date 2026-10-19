import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authApi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    finally { setLoading(false); }
  };

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Welcome Back</h1><p className="muted">Sign in to manage your tasks.</p>
    {error && <div className="alert error">{error}</div>}
    <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></label>
    <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></label>
    <button className="button primary full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
    <p className="center">Don't have an account? <Link to="/register">Register</Link></p>
  </form></div>;
}
