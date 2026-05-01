import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', padding: '60px 0 20px', marginTop: '60px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>AVSTS PROJECTS</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Professional HVAC & A/C Services (Installation, Repair, Maintenance). Quality service you can trust.
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.9rem' }}>CIN: U52335TG2022PTC168286</p>
        </div>
        
        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', lineHeight: '2' }}>
            <li><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a></li>
            <li><a href="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</a></li>
            <li><a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</a></li>
            <li><a href="/book" style={{ textDecoration: 'none', color: 'inherit' }}>Book Appointment</a></li>
            <li><a href="/status" style={{ textDecoration: 'none', color: 'inherit' }}>Track Status</a></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Contact Us</h4>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            UG-07, DSL Abacus IT Park, Uppal, Hyderabad, Telangana, India - 500039
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Email: avsts.projects@gmail.com
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '20px', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} AVSTS PROJECTS PRIVATE LIMITED. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
