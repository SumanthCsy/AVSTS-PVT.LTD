import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

const EmployeeLogin: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId === 'EMP001' && password === 'emp123') {
      navigate('/employee/dashboard');
    } else {
      setError('Invalid Employee ID or Password');
    }
  };

  return (
    <div className="section-padding container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingTop: '120px' }}>
      <form onSubmit={handleLogin} className="info-card" style={{ padding: '50px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', background: 'rgba(0,168,232,0.1)', color: 'var(--secondary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <UserCircle size={30} />
        </div>
        <h2 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Employee Portal</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Login to view your allotted tasks</p>

        {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

        <input 
          type="text" 
          placeholder="Employee ID" 
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
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
        <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.8rem' }}>Default: EMP001 / emp123</p>
      </form>
    </div>
  );
};

export default EmployeeLogin;
