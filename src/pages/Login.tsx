import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCircle } from 'lucide-react';
import { API_URL } from '../utils/api';

const Login: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === 'admin') {
      if (userId === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_logged_in', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid Admin Credentials');
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/employee/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, password })
        });
        const data = await res.json();
        if (data.success) {
          // Save active employee id to localStorage
          localStorage.setItem('active_emp_id', data.employee.id);
          localStorage.setItem('active_emp_name', data.employee.name);
          navigate('/employee/dashboard');
        } else {
          setError(data.error || 'Invalid Employee Credentials');
        }
      } catch (err) {
        setError('Network Error. Is backend running?');
      }
    }
  };

  return (
    <div className="section-padding container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleLogin} className="info-card" style={{ padding: '50px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
          <div onClick={() => setRole('employee')} style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', background: role === 'employee' ? 'var(--primary-color)' : 'transparent', color: role === 'employee' ? '#fff' : 'var(--text-muted)', border: '1px solid var(--primary-color)' }}>
            <UserCircle size={20} style={{ marginBottom: '4px' }} /><br/> Employee
          </div>
          <div onClick={() => setRole('admin')} style={{ cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', background: role === 'admin' ? 'var(--primary-color)' : 'transparent', color: role === 'admin' ? '#fff' : 'var(--text-muted)', border: '1px solid var(--primary-color)' }}>
            <Shield size={20} style={{ marginBottom: '4px' }} /><br/> Admin
          </div>
        </div>

        <h2 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>{role === 'admin' ? 'Admin Portal' : 'Employee Portal'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter your credentials to continue</p>

        {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

        <input 
          type="text" 
          placeholder={role === 'admin' ? "Admin Username" : "Employee ID"} 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required 
          style={{ marginBottom: '16px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          style={{ marginBottom: '24px' }}
        />

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Login
        </button>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.8rem' }}>
          {role === 'admin' ? 'Default: admin / admin123' : 'Default: EMP001 / emp123'}
        </p>
      </form>
    </div>
  );
};

export default Login;
