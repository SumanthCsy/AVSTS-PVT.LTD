import React, { useState, useEffect } from 'react';
import { Bell, Image as ImageIcon, LogOut, FileText, Settings as SettingsIcon, BarChart3, Edit, Trash2, UserPlus, Briefcase, X, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RichEditor from '../components/RichEditor';

const API_BASE = 'http://localhost:3001/api';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [filter, setFilter] = useState('All');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [slideshows, setSlideshows] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);

  // Career form state
  const [careerTitle, setCareerTitle] = useState('');
  const [careerContent, setCareerContent] = useState('');
  const [careerType, setCareerType] = useState('Full Time');
  const [careerLocation, setCareerLocation] = useState('Hyderabad');
  const [careerDate, setCareerDate] = useState(new Date().toISOString().slice(0, 10));

  // Post form state
  const [postContent, setPostContent] = useState('');

  // Modal State for Allotting Work
  const [allotModalOpen, setAllotModalOpen] = useState(false);
  const [selectedBookingForAllot, setSelectedBookingForAllot] = useState<string | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Employee Edit State
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editEmpModalOpen, setEditEmpModalOpen] = useState(false);

  // Settings State
  const [theme, setTheme] = useState(localStorage.getItem('avsts_theme') || 'theme1');
  const [anim, setAnim] = useState(localStorage.getItem('avsts_slide_anim') || 'slideLeftToRight');

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const bRes = await fetch(`${API_BASE}/bookings`);
      setBookings(await bRes.json());
      const eRes = await fetch(`${API_BASE}/employees`);
      setEmployees(await eRes.json());
      const pRes = await fetch(`${API_BASE}/posts`);
      setPosts(await pRes.json());
      const sRes = await fetch(`${API_BASE}/slideshows`);
      setSlideshows(await sRes.json());
      const cRes = await fetch(`${API_BASE}/careers`);
      setCareers(await cRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => navigate('/login');

  const saveSettings = () => {
    localStorage.setItem('avsts_theme', theme);
    localStorage.setItem('avsts_slide_anim', anim);
    window.location.reload();
  };

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  const openAllotModal = async (bookingId: string, currentAllotted: any[]) => {
    setSelectedBookingForAllot(bookingId);
    setSelectedEmployees(currentAllotted.map(a => a.id));
    
    // Fetch available employees
    try {
      const res = await fetch(`${API_BASE}/available-employees`);
      setAvailableEmployees(await res.json());
    } catch (e) {
      console.error(e);
    }

    setAllotModalOpen(true);
  };

  const toggleEmployeeSelection = (empId: string) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const saveAllotment = async () => {
    try {
      await fetch(`${API_BASE}/bookings/${selectedBookingForAllot}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIds: selectedEmployees })
      });
      setAllotModalOpen(false);
      fetchData(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEmployee = async (id: string) => {
    if(window.confirm('Delete employee?')) {
      await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const openEditEmployee = (emp: any) => {
    setEditingEmployee({ ...emp });
    setEditEmpModalOpen(true);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_BASE}/employees/${editingEmployee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingEmployee.name,
        mobile: editingEmployee.mobile,
        email: editingEmployee.email
      })
    });
    setEditEmpModalOpen(false);
    fetchData();
  };

  const createEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('password', 'emp123'); // default password
    
    await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      body: formData
    });
    form.reset();
    fetchData();
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.set('content', postContent); // Use rich editor content
    
    await fetch(`${API_BASE}/posts`, { method: 'POST', body: formData });
    form.reset();
    setPostContent('');
    fetchData();
  };

  const deletePost = async (id: number) => {
    if(window.confirm('Delete post?')) {
      await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const uploadSlideshow = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    await fetch(`${API_BASE}/slideshows`, { method: 'POST', body: new FormData(form) });
    form.reset();
    fetchData();
  };

  const deleteSlideshow = async (id: number) => {
    if(window.confirm('Delete image?')) {
      await fetch(`${API_BASE}/slideshows/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div className="container section-padding" style={{ display: 'flex', gap: '30px' }}>
      
      {/* Sidebar */}
      <div className="info-card" style={{ width: '250px', padding: '30px 20px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
        <h3 style={{ marginBottom: '40px', textAlign: 'center', color: 'var(--primary-color)' }}>Admin Panel</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <BarChart3 size={18} /> Analytics
          </button>
          <button onClick={() => setActiveTab('liveworks')} className={activeTab === 'liveworks' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <Bell size={18} /> Live Works
          </button>
          <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <Briefcase size={18} /> Bookings
          </button>
          <button onClick={() => setActiveTab('employees')} className={activeTab === 'employees' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <UserPlus size={18} /> Employees
          </button>
          <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <FileText size={18} /> Posts
          </button>
          <button onClick={() => setActiveTab('slideshows')} className={activeTab === 'slideshows' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <ImageIcon size={18} /> Slideshows
          </button>
          <button onClick={() => setActiveTab('careers')} className={activeTab === 'careers' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <Megaphone size={18} /> Careers
          </button>
          <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <SettingsIcon size={18} /> Settings
          </button>
        </div>

        <button onClick={handleLogout} className="btn-outline" style={{ width: '100%', justifyContent: 'flex-start', marginTop: '40px', border: 'none', color: '#ef4444' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="info-card" style={{ flexGrow: 1, padding: '40px', minHeight: '600px', position: 'relative' }}>
        
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Dashboard Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--text-muted)' }}>Total Requests</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{bookings.length}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--text-muted)' }}>Completed Services</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{bookings.filter(b => b.status === 'Completed').length}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--text-muted)' }}>Total Employees</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{employees.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* LIVE WORKS TAB */}
        {activeTab === 'liveworks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Live / Running Works</h2>
            </div>
            <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Status</th>
                    <th>Assigned Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter(b => b.status === 'In Progress' || b.status === 'Accepted').map(b => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.name}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(0,168,232,0.2)', color: 'var(--secondary-color)' }}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {b.allotted.map((emp:any) => <span key={emp.id} style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px' }}>{emp.name} ({emp.id})</span>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.filter(b => b.status === 'In Progress' || b.status === 'Accepted').length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center' }}>No live works running.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Manage Employees</h2>
            </div>
            
            {/* Create Employee Form */}
            <form onSubmit={createEmployee} style={{ background: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>Create Employee Credential</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label>Employee Name</label><input type="text" name="name" placeholder="Full Name" required /></div>
                <div><label>Employee ID</label><input type="text" name="id" placeholder="e.g. EMP006" required /></div>
                <div><label>Email Address</label><input type="email" name="email" placeholder="Email" required /></div>
                <div><label>Mobile Number</label><input type="tel" name="mobile" placeholder="+91" required /></div>
                <div style={{ gridColumn: '1 / -1' }}><label>Profile Image</label><input type="file" name="image" style={{ padding: '10px', background: '#fff' }} /></div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Create Employee</button>
            </form>

            {/* Employee List */}
            <div>
              <h3 style={{ marginBottom: '16px' }}>Team Members</h3>
              <table className="data-table">
                <thead><tr><th>EMP ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Actions</th></tr></thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 600 }}>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.mobile}</td>
                      <td>
                        <button onClick={() => openEditEmployee(emp)} style={{ border: 'none', background: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginRight: '10px' }}><Edit size={18} /></button>
                        <button onClick={() => deleteEmployee(emp.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB (Sheet Format & Allotment) */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Service Requests</h2>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '200px', marginBottom: 0 }}>
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Service Type</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Allotted To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.name}</td>
                      <td>{b.service}</td>
                      <td>{b.location}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                          background: b.status === 'Completed' ? 'rgba(16,185,129,0.2)' : b.status === 'In Progress' ? 'rgba(0,168,232,0.2)' : b.status === 'Cancelled' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: b.status === 'Completed' ? '#10b981' : b.status === 'In Progress' ? 'var(--secondary-color)' : b.status === 'Cancelled' ? '#ef4444' : '#f59e0b'
                        }}>
                          {b.status}
                        </span>
                        {b.status === 'Cancelled' && b.cancelReason && (
                          <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '4px', maxWidth: '150px' }}>
                            Reason: {b.cancelReason}
                          </div>
                        )}
                      </td>
                      <td>
                        {b.allotted && b.allotted.length > 0 ? (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {b.allotted.map((emp:any) => <span key={emp.id} style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px' }}>{emp.name}</span>)}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <button 
                          onClick={() => openAllotModal(b.id, b.allotted || [])}
                          className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          Allot Work
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center' }}>No requests found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Manage Posts & Updates</h2>
            </div>
            
            <form onSubmit={createPost} style={{ background: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>Create New Post</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" name="title" placeholder="Post Title" required />
                <div>
                  <label>Post Content</label>
                  <RichEditor value={postContent} onChange={setPostContent} />
                </div>
                <input type="date" name="date" required />
                <div><label>Upload Image:</label><input type="file" name="image" style={{ marginLeft: '10px' }} /></div>
                <button type="submit" className="btn-primary" style={{ width: '200px' }}>Publish Post</button>
              </div>
            </form>

            <h3 style={{ marginBottom: '16px' }}>Live Posts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {posts.map(post => (
                <div key={post.id} className="info-card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {post.image && <img src={`http://localhost:3001${post.image}`} alt="post" style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ color: 'var(--primary-color)' }}>{post.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{post.date}</p>
                    <p>{post.content}</p>
                  </div>
                  <button onClick={() => deletePost(post.id)} className="btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDESHOWS TAB */}
        {activeTab === 'slideshows' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Manage Slideshow Images</h2>
            </div>
            
            <form onSubmit={uploadSlideshow} style={{ background: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>Upload New Slide</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Slide Title (Optional)</label>
                  <input type="text" name="title" placeholder="e.g. Expert AC Installation" />
                </div>
                <div>
                  <label>Animation Style</label>
                  <select name="animation" style={{ background: '#fff' }}>
                    <option value="fade">Fade In</option>
                    <option value="left">Slide Left to Right</option>
                    <option value="right">Slide Right to Left</option>
                    <option value="flip">Flip</option>
                  </select>
                </div>
                <div>
                  <label>Slide Image</label>
                  <input type="file" name="image" required style={{ background: '#fff' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary">Upload Slide</button>
            </form>

            <h3 style={{ marginBottom: '16px' }}>Current Slides</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {slideshows.map(slide => (
                <div key={slide.id} className="info-card" style={{ padding: '10px' }}>
                  <img src={`http://localhost:3001${slide.image}`} alt="slide" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                  <button onClick={() => deleteSlideshow(slide.id)} className="btn-outline" style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444', justifyContent: 'center' }}><Trash2 size={18} /> Delete Slide</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAREERS TAB */}
        {activeTab === 'careers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Manage Career Postings</h2>
            </div>

            {/* Create Career Posting Form */}
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px' }}>Post a New Job Opening</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Job Title</label>
                  <input type="text" value={careerTitle} onChange={e => setCareerTitle(e.target.value)} placeholder="e.g. HVAC Technician" required />
                </div>
                <div>
                  <label>Employment Type</label>
                  <select value={careerType} onChange={e => setCareerType(e.target.value)} style={{ background: '#fff' }}>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label>Location</label>
                  <input type="text" value={careerLocation} onChange={e => setCareerLocation(e.target.value)} placeholder="e.g. Hyderabad" />
                </div>
                <div>
                  <label>Posting Date</label>
                  <input type="date" value={careerDate} onChange={e => setCareerDate(e.target.value)} />
                </div>
              </div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Job Description</label>
              <RichEditor
                value={careerContent}
                onChange={setCareerContent}
                placeholder="Write the job description, requirements, responsibilities using formatting tools above..."
                minHeight="250px"
              />
              <button
                className="btn-primary"
                style={{ marginTop: '20px' }}
                onClick={async () => {
                  if (!careerTitle || !careerContent) { alert('Fill in title and description.'); return; }
                  await fetch(`${API_BASE}/careers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: careerTitle, content: careerContent, type: careerType, location: careerLocation, date: careerDate })
                  });
                  setCareerTitle(''); setCareerContent('');
                  fetchData();
                }}
              >
                Publish Job Opening
              </button>
            </div>

            {/* Live Career Postings */}
            <h3 style={{ marginBottom: '16px' }}>Live Job Postings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {careers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No job postings yet.</p>}
              {careers.map(job => (
                <div key={job.id} className="info-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span style={{ background: 'rgba(0,86,179,0.1)', color: 'var(--primary-color)', padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }}>{job.type}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {job.location}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📅 {job.date}</span>
                      <span style={{ padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, background: job.active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: job.active ? '#10b981' : '#ef4444' }}>
                        {job.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>{job.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <button
                      onClick={async () => {
                        await fetch(`${API_BASE}/careers/${job.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...job, active: job.active ? 0 : 1 }) });
                        fetchData();
                      }}
                      className="btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      {job.active ? 'Hide' : 'Activate'}
                    </button>
                    <button
                      onClick={async () => { if(window.confirm('Delete posting?')) { await fetch(`${API_BASE}/careers/${job.id}`, { method: 'DELETE' }); fetchData(); }}}
                      style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>App Settings</h2>
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px' }}>Theme Colors</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Select the primary gradient theme for the application backgrounds.</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div onClick={() => setTheme('theme1')} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #0056b3, #00a8e8)', cursor: 'pointer', border: theme === 'theme1' ? '3px solid var(--text-main)' : 'none' }}></div>
                <div onClick={() => setTheme('theme2')} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', cursor: 'pointer', border: theme === 'theme2' ? '3px solid var(--text-main)' : 'none' }}></div>
                <div onClick={() => setTheme('theme3')} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #14b8a6)', cursor: 'pointer', border: theme === 'theme3' ? '3px solid var(--text-main)' : 'none' }}></div>
                <div onClick={() => setTheme('theme4')} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', cursor: 'pointer', border: theme === 'theme4' ? '3px solid var(--text-main)' : 'none' }}></div>
                <div onClick={() => setTheme('theme5')} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', cursor: 'pointer', border: theme === 'theme5' ? '3px solid var(--text-main)' : 'none' }}></div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '30px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ marginBottom: '16px' }}>Slideshow Animation</h3>
              <select value={anim} onChange={(e) => setAnim(e.target.value)} style={{ background: '#fff' }}>
                <option value="fadein">Fade In</option>
                <option value="slideLeftToRight">Left to Right</option>
                <option value="slideRightToLeft">Right to Left</option>
                <option value="flip">Flip 3D</option>
              </select>
            </div>

            <button onClick={saveSettings} className="btn-primary" style={{ marginTop: '30px' }}>Save Changes</button>
          </div>
        )}

      </div>

      {/* ALLOTMENT MODAL */}
      {allotModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="info-card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={() => setAllotModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '8px' }}>Allot Work</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Assign team members to <strong>{selectedBookingForAllot}</strong></p>
            
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Available Employees (Not currently in active work):</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', maxHeight: '300px', overflowY: 'auto' }}>
              {availableEmployees.map(emp => (
                <div 
                  key={emp.id} 
                  onClick={() => toggleEmployeeSelection(emp.id)}
                  style={{ 
                    padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer',
                    background: selectedEmployees.includes(emp.id) ? 'rgba(0,168,232,0.1)' : '#fff',
                    borderColor: selectedEmployees.includes(emp.id) ? 'var(--secondary-color)' : 'var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>{emp.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{emp.id} | {emp.mobile}</p>
                    </div>
                    {selectedEmployees.includes(emp.id) && <div style={{ width: '20px', height: '20px', background: 'var(--primary-color)', borderRadius: '50%' }}></div>}
                  </div>
                </div>
              ))}
              {availableEmployees.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No employees available right now. All are busy with live works!
                </div>
              )}
            </div>

            <button onClick={saveAllotment} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Confirm Allotment
            </button>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editEmpModalOpen && editingEmployee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="info-card" style={{ maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Edit Employee Details</h3>
              <button onClick={() => setEditEmpModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <form onSubmit={handleUpdateEmployee}>
              <label>Employee Name</label>
              <input 
                type="text" 
                value={editingEmployee.name} 
                onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})} 
                required 
              />
              <label>Mobile Number</label>
              <input 
                type="tel" 
                value={editingEmployee.mobile} 
                onChange={e => setEditingEmployee({...editingEmployee, mobile: e.target.value})} 
                required 
              />
              <label>Email Address</label>
              <input 
                type="email" 
                value={editingEmployee.email} 
                onChange={e => setEditingEmployee({...editingEmployee, email: e.target.value})} 
                required 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>Update Details</button>
                <button type="button" onClick={() => setEditEmpModalOpen(false)} className="btn-outline" style={{ flexGrow: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
