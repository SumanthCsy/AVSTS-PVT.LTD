import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Login
    if (email === 'admin@avsts.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="section-padding container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '50px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', background: 'rgba(0,112,243,0.1)', color: 'var(--primary-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Lock size={30} />
        </div>
        <h2 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Admin Portal</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Login to manage AVSTS Projects</p>

        {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

        <input 
          type="email" 
          placeholder="Admin Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Login
        </button>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.8rem' }}>Default: admin@avsts.com / admin123</p>
      </form>
    </div>
  );
};

export default AdminLogin;
