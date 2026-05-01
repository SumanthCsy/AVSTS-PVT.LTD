import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Phone, User, CheckCircle, Clock, Briefcase, X, CreditCard } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [empProfile, setEmpProfile] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Modal states
  const [completeModalTask, setCompleteModalTask] = useState<any>(null);
  const [cancelModalTask, setCancelModalTask] = useState<any>(null);
  const [customReason, setCustomReason] = useState('');

  const empId = localStorage.getItem('active_emp_id');
  const empName = localStorage.getItem('active_emp_name');

  useEffect(() => {
    if (!empId) { navigate('/login'); return; }
    fetchTasks();
    fetchProfile();
  }, [empId]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/employee/${empId}/tasks`);
      setTasks(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      const all = await res.json();
      const me = all.find((e: any) => e.id === empId);
      setEmpProfile(me || null);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('active_emp_id');
    localStorage.removeItem('active_emp_name');
    navigate('/login');
  };

  const updateStatus = async (taskId: string, status: string, reason?: string) => {
    try {
      await fetch(`${API_BASE}/bookings/${taskId}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, cancelReason: reason })
      });
      setCompleteModalTask(null);
      setCancelModalTask(null);
      setCustomReason('');
      fetchTasks();
    } catch (e) { console.error(e); }
  };

  const activeTasks = tasks.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const cancelledTasks = tasks.filter(t => t.status === 'Cancelled');
  
  const pending = activeTasks.length;
  const done = completedTasks.length;

  const avatarUrl = empProfile?.image
    ? `http://localhost:3001${empProfile.image}`
    : null;

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ─── HERO WELCOME BANNER ─── */}
      <section 
        className="mobile-padding-sm"
        style={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          padding: '50px 0 70px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div className="container mobile-stack-center" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div className="mobile-stack-center" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Avatar circle */}
            <div
              onClick={() => setProfileOpen(true)}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: avatarUrl ? 'none' : 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.6)',
                overflow: 'hidden', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
              title="View Profile"
            >
              {avatarUrl
                ? <img src={avatarUrl} alt={empName || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={36} color="rgba(255,255,255,0.9)" />
              }
            </div>

            <div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Welcome back 👋</p>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: '#fff',
                margin: 0,
                background: 'linear-gradient(90deg, #fff 30%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {empName}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '4px' }}>Employee ID: <strong style={{ color: '#fff' }}>{empId}</strong></p>
            </div>
          </div>

          <div className="mobile-full-width" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setProfileOpen(true)}
              className="mobile-full-width"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <CreditCard size={16} /> My ID Card
            </button>
            <button
              onClick={handleLogout}
              className="mobile-full-width"
              style={{ background: 'rgba(239,68,68,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(239,68,68,0.4)', color: '#fff', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <div className="container" style={{ transform: 'translateY(-28px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Total Assigned', val: tasks.length, color: 'var(--primary-color)', bg: 'rgba(0,86,179,0.08)' },
            { label: 'Pending Works', val: pending, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
            { label: 'Completed', val: done, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff', borderRadius: '16px', padding: '16px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: `1px solid ${stat.bg}`,
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color }}>{stat.val}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.2 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', marginBottom: '30px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button 
            onClick={() => setActiveTab('active')}
            style={{ padding: '12px 16px', border: 'none', background: 'none', borderBottom: activeTab === 'active' ? '3px solid var(--primary-color)' : 'none', color: activeTab === 'active' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.9rem' }}
          >
            Allotted ({pending})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            style={{ padding: '12px 16px', border: 'none', background: 'none', borderBottom: activeTab === 'completed' ? '3px solid var(--primary-color)' : 'none', color: activeTab === 'completed' ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.9rem' }}
          >
            Completed ({done})
          </button>
        </div>
      </div>

      {/* ─── TASKS LIST ─── */}
      <div className="container" style={{ paddingBottom: '80px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
          {activeTab === 'active' ? 'Ongoing Services' : 'Completed Services'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {(activeTab === 'active' ? activeTasks : completedTasks).map(task => (
            <div key={task.id} className="info-card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Task header band */}
              <div 
                className="mobile-stack"
                style={{
                  padding: '20px',
                  background: task.status === 'Completed'
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(20,184,166,0.07))'
                    : 'linear-gradient(135deg, rgba(0,86,179,0.05), rgba(0,168,232,0.05))',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
                  borderBottom: '1px solid var(--glass-border)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.1rem' }}>{task.id}</span>
                    <span style={{
                      padding: '3px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
                      background: task.status === 'Completed' ? 'rgba(16,185,129,0.15)' : task.status === 'In Progress' ? 'rgba(0,168,232,0.15)' : 'rgba(245,158,11,0.15)',
                      color: task.status === 'Completed' ? '#10b981' : task.status === 'In Progress' ? 'var(--secondary-color)' : '#f59e0b'
                    }}>
                      {task.status === 'Completed' ? '✓ ' : task.status === 'In Progress' ? '⚡ ' : '⏳ '}{task.status}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{task.service}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} /> {task.date} at {task.time}
                  </p>
                </div>
                {task.status !== 'Completed' && (
                  <div className="mobile-btn-group" style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setCancelModalTask(task)}
                      className="btn-outline"
                      style={{ padding: '10px 22px', borderRadius: '20px', color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button
                      onClick={() => setCompleteModalTask(task)}
                      style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                    >
                      <CheckCircle size={16} /> Mark Complete
                    </button>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="mobile-padding-sm" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                {/* Client card */}
                <div style={{ background: 'rgba(248,250,252,0.8)', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontWeight: 700, marginBottom: '14px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Client Details</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,86,179,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={16} color="var(--primary-color)" />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{task.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,168,232,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Phone size={16} color="var(--secondary-color)" />
                      </div>
                      <span style={{ fontSize: '0.9rem' }}>{task.phone}</span>
                      <a 
                        href={`tel:${task.phone.replace(/\s+/g, '')}`} 
                        className="btn-primary pulse-btn"
                        style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: '12px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 800, background: 'var(--primary-color)' }}
                      >
                        Call Customer
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <MapPin size={16} color="#10b981" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.9rem' }}>{task.location}</span>
                        {task.mapLink && (
                          <a href={task.mapLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '4px', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.82rem' }}>
                            📍 Open in Maps
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work details */}
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '14px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Work Details</p>
                  <div style={{ background: 'rgba(248,250,252,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    <strong>Issue:</strong> {task.problem}
                  </div>
                  {task.coWorkers && task.coWorkers.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>Co-workers on this job:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {task.coWorkers.map((cw: any) => (
                          <span key={cw.id} style={{ background: 'linear-gradient(135deg,var(--primary-color),var(--secondary-color))', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                            {cw.name} · {cw.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,86,179,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary-color)' }}>
                <Briefcase size={36} />
              </div>
              <h3 style={{ marginBottom: '8px' }}>No Tasks Assigned</h3>
              <p style={{ color: 'var(--text-muted)' }}>You have no work allotted at the moment. Check back later.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── PROFILE ID CARD MODAL ─── */}
      {profileOpen && (
        <div
          onClick={() => setProfileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '380px' }}>

            {/* ID Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
              position: 'relative'
            }}>
              {/* Close */}
              <button
                onClick={() => setProfileOpen(false)}
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
              >
                <X size={16} />
              </button>

              {/* Card header */}
              <div style={{ padding: '28px 28px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <img src="/logo.png" alt="AVSTS" style={{ height: '36px', filter: 'brightness(0) invert(1)' }} />
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800, fontSize: '0.85rem', margin: 0 }}>AVSTS PROJECTS</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', margin: 0 }}>PRIVATE LIMITED</p>
                  </div>
                </div>

                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    border: '4px solid rgba(255,255,255,0.6)',
                    overflow: 'hidden', background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                  }}>
                    {avatarUrl
                      ? <img src={avatarUrl} alt={empName || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={48} color="rgba(255,255,255,0.8)" />
                    }
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.5rem' }}>{empProfile?.name || empName}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>HVAC Service Technician</p>
                </div>
              </div>

              {/* White card body */}
              <div style={{ background: '#fff', margin: '0 12px 12px', borderRadius: '16px', padding: '24px' }}>
                {[
                  { label: 'Employee ID', val: empProfile?.id || empId, icon: '🪪' },
                  { label: 'Mobile', val: empProfile?.mobile || '—', icon: '📞' },
                  { label: 'Email', val: empProfile?.email || '—', icon: '✉️' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{row.icon}</span>
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</p>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: '#1e293b', wordBreak: 'break-all' }}>{row.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPLETE CONFIRMATION MODAL ─── */}
      {completeModalTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className="info-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ marginBottom: '12px' }}>Confirm Completion</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', lineHeight: 1.5 }}>
              Are you sure you want to mark task <strong>{completeModalTask.id}</strong> as completed? This will inform the client and close the request.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => updateStatus(completeModalTask.id, 'Completed')} className="btn-primary" style={{ flexGrow: 1, justifyContent: 'center' }}>Yes, Completed</button>
              <button onClick={() => setCompleteModalTask(null)} className="btn-outline" style={{ flexGrow: 1 }}>Wait, No</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CANCEL REASON MODAL ─── */}
      {cancelModalTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div className="info-card" style={{ maxWidth: '450px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Cancel Request</h3>
              <button onClick={() => setCancelModalTask(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Please select a reason for cancelling this service request:</p>
            
            <div style={{ marginBottom: '24px' }}>
              {['Customer refused', 'Customer not responding', 'Customer not available'].map(reason => (
                <button 
                  key={reason} 
                  className="cancel-reason-btn"
                  onClick={() => updateStatus(cancelModalTask.id, 'Cancelled', reason)}
                >
                  {reason}
                </button>
              ))}
              
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-muted)' }}>OR WRITE OTHER ISSUE:</p>
                <textarea 
                  placeholder="Explain why this work cannot be done..."
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  style={{ minHeight: '80px', marginBottom: '16px' }}
                />
                <button 
                  disabled={!customReason.trim()}
                  onClick={() => updateStatus(cancelModalTask.id, 'Cancelled', customReason)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', opacity: customReason.trim() ? 1 : 0.5 }}
                >
                  Submit Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;
