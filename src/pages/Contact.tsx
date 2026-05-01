import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="section-padding container">
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Have questions or need an immediate response? Get in touch with us today.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <form className="glass-panel" style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>Send an Enquiry</h2>
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Name</label>
            <input type="text" placeholder="Your Name" required />
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Phone</label>
            <input type="tel" placeholder="Your Phone Number" required />
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
            <input type="email" placeholder="Your Email Address" required />
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Message</label>
            <textarea placeholder="How can we help you?" rows={5} required></textarea>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
              Submit Enquiry
            </button>
          </form>
        </div>

        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,112,243,0.1)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Email Us</h3>
              <p style={{ color: 'var(--text-muted)' }}>avsts.projects@gmail.com</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,223,216,0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Call Us</h3>
              <p style={{ color: 'var(--text-muted)' }}>+91 XXXXX XXXXX</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Location</h3>
                <p style={{ color: 'var(--text-muted)' }}>UG-07, DSL Abacus IT Park, Uppal, Hyderabad</p>
              </div>
            </div>
            <div style={{ flexGrow: 1, minHeight: '200px', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.568285514032!2d78.5583597!3d17.3845183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb98df492f23db%3A0xc6c76e2cba1b8fc!2sDSL%20Abacus%20IT%20Park!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
