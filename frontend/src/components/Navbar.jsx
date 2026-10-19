import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="brand" onClick={() => navigate('/dashboard')}>Task Manager</div>
      <div className="nav-right">
        <span>{user?.name || 'User'}</span>
        <button className="button secondary" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
