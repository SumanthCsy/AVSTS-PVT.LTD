import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, Thermometer, Wind, ShieldAlert, Zap, Settings } from 'lucide-react';

const servicesList = [
  { title: 'A/C System Maintenance', icon: <Wrench size={32} /> },
  { title: 'A/C System Repair', icon: <Settings size={32} /> },
  { title: 'Heating System Installation', icon: <Thermometer size={32} /> },
  { title: 'Heating System Maintenance', icon: <ShieldAlert size={32} /> },
  { title: 'Heating System Repair', icon: <Wrench size={32} /> },
  { title: 'HVAC System Maintenance', icon: <Wind size={32} /> },
  { title: 'AC Installation', icon: <Zap size={32} /> },
  { title: 'HVAC Repair', icon: <Settings size={32} /> },
  { title: 'Ductless Heating & A/C', icon: <Thermometer size={32} /> },
  { title: 'HVAC Duct & Vent Cleaning', icon: <Wind size={32} /> },
  { title: 'HVAC Duct & Vent Installation', icon: <Wrench size={32} /> },
  { title: 'HVAC Duct & Vent Repair', icon: <ShieldAlert size={32} /> },
  { title: 'Thermostat Installation', icon: <Thermometer size={32} /> },
  { title: 'Thermostat Repair', icon: <Zap size={32} /> },
];

const Services: React.FC = () => {
  return (
    <div className="section-padding container">
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Our Services</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Comprehensive HVAC and Air Conditioning solutions tailored for your residential and commercial needs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {servicesList.map((service, index) => (
          <div key={index} className="info-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(0,168,232,0.1)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              {service.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-main)', flexGrow: 1 }}>{service.title}</h3>
            
            <Link to="/book" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              Book Service <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
