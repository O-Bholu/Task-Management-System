import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks/create" element={<TaskForm />} />
      <Route path="/tasks/:id/edit" element={<TaskForm />} />
    </Route>
    <Route path="*" element={<Navigate to={localStorage.getItem('token') ? '/dashboard' : '/login'} replace />} />
  </Routes>;
}
