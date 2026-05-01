import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
  const isEmployee = localStorage.getItem('active_emp_id') !== null;
  const isLoggedIn = isAdmin || isEmployee;

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('active_emp_id');
    localStorage.removeItem('active_emp_name');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="AVSTS Logo" style={{ height: '100px' }} />
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
          <Link to="/enquiry" className={`nav-link ${location.pathname === '/enquiry' ? 'active' : ''}`}>Enquiry</Link>
          <Link to="/posts" className={`nav-link ${location.pathname === '/posts' ? 'active' : ''}`}>Posts</Link>
          <Link to="/careers" className={`nav-link ${location.pathname === '/careers' ? 'active' : ''}`}>Careers</Link>
          
          {isLoggedIn ? (
            <>
              <Link to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"} className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
          )}
          
          <Link to="/book" className="btn-primary">Book Now</Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="mobile-only" onClick={() => setMobileOpen(!mobileOpen)} style={{ cursor: 'pointer', color: 'var(--primary-color)' }}>
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-only" style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Home</Link>
          <Link to="/services" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Services</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>About Us</Link>
          <Link to="/enquiry" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Enquiry</Link>
          <Link to="/posts" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Posts</Link>
          <Link to="/careers" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Careers</Link>
          
          {isLoggedIn ? (
            <>
              <Link to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 600 }}>Dashboard</Link>
              <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, padding: 0, fontSize: '1rem' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600 }}>Login</Link>
          )}
          
          <Link to="/book" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textAlign: 'center', marginTop: '10px' }}>Book Now</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
