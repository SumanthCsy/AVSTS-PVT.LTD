import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Check, ChevronDown, Search } from 'lucide-react';

const servicesOptions = [
  'A/C System Maintenance', 'A/C System Repair', 'Heating System Installation',
  'Heating System Maintenance', 'Heating System Repair', 'HVAC System Maintenance',
  'AC Installation', 'HVAC Repair', 'Ductless Heating & A/C', 'HVAC Duct & Vent Cleaning',
  'HVAC Duct & Vent Installation', 'HVAC Duct & Vent Repair', 'Thermostat Installation', 'Thermostat Repair'
];

const Booking: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) {
      alert('Please select a service first.');
      return;
    }
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const id = `AVS-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      id,
      service: selectedService,
      name: formData.get('name'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      address: formData.get('address'),
      mapLink: formData.get('mapLink'),
      problem: formData.get('problem'),
      date: formData.get('date'),
      time: formData.get('time')
    };

    try {
      await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setBookingId(id);
      setIsSubmitting(false);
      setSubmitted(true);
      gsap.fromTo('.success-msg', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
    } catch (err) {
      console.error(err);
      alert('Failed to submit booking. Is backend running?');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="section-padding container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div className="info-card success-msg" style={{ padding: '50px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={40} />
          </div>
          <h2 style={{ marginBottom: '16px' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your request has been submitted successfully.</p>
          <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '12px', marginBottom: '32px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Booking ID</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{bookingId}</p>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please save this ID to track your service status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding container">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '4px', margin: 0 }}>Book a Service</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Select a service and fill out your details</p>
          </div>
          <Link to="/status" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}>
            <Search size={18} /> Track My Status
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          {/* SERVICE DROPDOWN */}
          <div className="info-card" style={{ padding: '40px', overflow: 'visible', position: 'relative', zIndex: 10 }}>
            <h3 style={{ marginBottom: '20px' }}>1. Select Service Type</h3>
            <div style={{ position: 'relative' }}>
              {/* Trigger Button */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${selectedService ? 'var(--primary-color)' : '#e2e8f0'}`,
                  background: selectedService ? 'rgba(0,86,179,0.04)' : '#fff',
                  transition: 'all 0.2s ease', userSelect: 'none'
                }}
              >
                <span style={{ fontWeight: selectedService ? 600 : 400, color: selectedService ? 'var(--primary-color)' : 'var(--text-muted)', fontSize: '1rem' }}>
                  {selectedService || 'Choose a service...'}
                </span>
                <ChevronDown
                  size={20}
                  color={selectedService ? 'var(--primary-color)' : '#94a3b8'}
                  style={{ transition: 'transform 0.2s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}
                />
              </div>

              {/* Dropdown List */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                  background: '#fff', borderRadius: '14px', zIndex: 9999,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                  border: '1px solid #e2e8f0',
                  maxHeight: '320px', overflowY: 'auto'
                }}>
                  {servicesOptions.map((service, i) => (
                    <div
                      key={service}
                      onClick={() => { setSelectedService(service); setDropdownOpen(false); }}
                      style={{
                        padding: '13px 18px',
                        display: 'flex', alignItems: 'center', gap: '12px',
                        cursor: 'pointer',
                        background: selectedService === service ? 'rgba(0,86,179,0.06)' : 'transparent',
                        borderBottom: i < servicesOptions.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,86,179,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = selectedService === service ? 'rgba(0,86,179,0.06)' : 'transparent')}
                    >
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${selectedService === service ? 'var(--primary-color)' : '#cbd5e1'}`,
                        background: selectedService === service ? 'var(--primary-color)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {selectedService === service && <Check size={11} color="#fff" />}
                      </div>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: selectedService === service ? 600 : 400,
                        color: selectedService === service ? 'var(--primary-color)' : 'var(--text-main)'
                      }}>
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected badge */}
            {selectedService && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'rgba(0,86,179,0.1)', color: 'var(--primary-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ {selectedService}
                </span>
                <button type="button" onClick={() => setSelectedService('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>Clear</button>
              </div>
            )}
          </div>

          {/* PERSONAL DETAILS */}
          <div className="info-card" style={{ padding: '40px' }}>
            <h3 style={{ marginBottom: '24px' }}>2. Personal & Location Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Full Name</label>
                <input type="text" name="name" placeholder="Your full name" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Phone Number</label>
                <input type="tel" name="phone" placeholder="+91 98765 43210" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Preferred Date</label>
                <input type="date" name="date" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Preferred Time</label>
                <input type="time" name="time" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>City / Area</label>
                <input type="text" name="location" placeholder="e.g. Uppal, Hyderabad" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Full Address</label>
                <input type="text" name="address" placeholder="House No, Street, Landmark" required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Google Maps Link <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span></label>
                <input type="url" name="mapLink" placeholder="https://maps.google.com/..." />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Problem Description</label>
                <textarea name="problem" placeholder="Briefly describe your issue..." rows={4} required></textarea>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ padding: '16px 40px', fontSize: '1.1rem', margin: '0 auto', width: '100%', maxWidth: '400px', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
