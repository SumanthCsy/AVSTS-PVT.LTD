import React, { useState } from 'react';
import { Search, Clock, CheckCircle, Package } from 'lucide-react';
import gsap from 'gsap';

const CheckStatus: React.FC = () => {
  const [bookingId, setBookingId] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    setError('');
    setData(null);

    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${bookingId}`);
      if (!res.ok) throw new Error('Booking not found');
      const json = await res.json();
      setData(json);
      gsap.fromTo('.status-result', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="section-padding container" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', textAlign: 'center' }}>Track Booking Status</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px' }}>
          Enter your unique Booking ID to check the real-time status of your request.
        </p>

        <form onSubmit={handleSearch} className="info-card" style={{ padding: '40px', marginBottom: '40px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Booking ID</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="e.g. AVS-123456" 
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              style={{ marginBottom: 0 }}
              required 
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 30px' }}>
              <Search size={20} />
            </button>
          </div>
          {error && <p style={{ color: '#ef4444', marginTop: '16px', fontSize: '0.9rem' }}>{error}</p>}
        </form>

        {data && (
          <div className="info-card status-result" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Status Details for {data.id}</h3>
              <span style={{ 
                padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
                background: data.status === 'Completed' ? 'rgba(16,185,129,0.1)' : data.status === 'Cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(0,86,179,0.1)',
                color: data.status === 'Completed' ? '#10b981' : data.status === 'Cancelled' ? '#ef4444' : 'var(--primary-color)'
              }}>
                {data.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '50px' }}>
              <div style={{ position: 'absolute', top: '25px', left: '10%', right: '10%', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
              <div style={{ 
                position: 'absolute', top: '25px', left: '10%', 
                width: data.status === 'Completed' ? '80%' : (data.status === 'In Progress' ? '40%' : '0%'), 
                height: '2px', background: 'var(--primary-color)', zIndex: 0, transition: 'width 0.5s ease' 
              }}></div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Received</span>
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '50%', 
                  background: data.status === 'In Progress' || data.status === 'Completed' ? 'var(--primary-color)' : '#fff', 
                  border: '2px solid' + (data.status === 'In Progress' || data.status === 'Completed' ? 'var(--primary-color)' : '#e2e8f0'),
                  color: data.status === 'In Progress' || data.status === 'Completed' ? 'white' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Clock size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active</span>
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '50%', 
                  background: data.status === 'Completed' ? '#10b981' : '#fff', 
                  border: '2px solid' + (data.status === 'Completed' ? '#10b981' : '#e2e8f0'),
                  color: data.status === 'Completed' ? 'white' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Done</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Service Type</label>
                  <p style={{ fontWeight: 600, margin: 0 }}>{data.service}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Scheduled For</label>
                  <p style={{ fontWeight: 600, margin: 0 }}>{data.date} at {data.time}</p>
                </div>
              </div>

              {data.status === 'Cancelled' && (
                <div style={{ padding: '16px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '24px' }}>
                  <p style={{ color: '#e11d48', fontSize: '0.9rem', margin: 0 }}><strong>Cancellation Reason:</strong> {data.cancelReason || 'Not specified'}</p>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Team Members Allotted</label>
                {data.allotted && data.allotted.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                    {data.allotted.map((emp: any) => (
                      <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>{emp.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>ID: {emp.id}</p>
                        </div>
                        <a 
                          href={`tel:${emp.mobile}`} 
                          className="pulse-btn"
                          style={{ background: 'var(--primary-color)', color: '#fff', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          Call Now
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Searching for best available team members...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStatus;
