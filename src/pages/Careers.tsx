import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { API_URL } from '../utils/api';

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/careers`)
      .then(res => res.json())
      .then(data => setJobs(data.filter((j: any) => j.active === 1)))
      .catch(console.error);
  }, []);

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0,86,179,0.08)', color: 'var(--primary-color)', padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
          <Briefcase size={16} /> We're Hiring!
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '16px' }}>
          Join the AVSTS Team
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.7 }}>
          We are always looking for passionate, skilled professionals to join our growing HVAC & A/C services team across Hyderabad and beyond.
        </p>
      </section>

      {/* Job Listings */}
      <section className="container">
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(0,86,179,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary-color)' }}>
              <Briefcase size={36} />
            </div>
            <h2 style={{ marginBottom: '12px', color: 'var(--text-main)' }}>No Openings Right Now</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
              There are no active job postings at the moment. Check back later or send your resume to <strong>careers@avsts.in</strong>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '860px', margin: '0 auto' }}>
            {jobs.map(job => (
              <div
                key={job.id}
                className="info-card"
                style={{ padding: '0', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  style={{ padding: '28px 32px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ background: 'rgba(0,86,179,0.1)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {job.type || 'Full Time'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <MapPin size={13} /> {job.location || 'Hyderabad'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Calendar size={13} /> Posted {new Date(job.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main)' }}>{job.title}</h2>
                  </div>

                  <div style={{ color: 'var(--primary-color)', flexShrink: 0 }}>
                    {expanded === job.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                {/* Expanded Content */}
                {expanded === job.id && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '28px 32px' }}>
                    <div
                      className="rich-content"
                      dangerouslySetInnerHTML={{ __html: job.content }}
                      style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '30px' }}
                    />
                    <a
                      href={`mailto:careers@avsts.in?subject=Application for ${job.title}`}
                      className="btn-primary"
                      style={{ display: 'inline-flex' }}
                    >
                      <Send size={16} /> Apply via Email
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Join Us */}
      <section className="container section-padding">
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>Why Join AVSTS?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {[
            { emoji: '🛠️', title: 'Hands-On Work', desc: 'Work on real HVAC & A/C projects across Hyderabad.' },
            { emoji: '📈', title: 'Career Growth', desc: 'Clear progression paths with skill-based promotions.' },
            { emoji: '🧑‍🤝‍🧑', title: 'Supportive Team', desc: 'Work alongside experienced, certified professionals.' },
            { emoji: '💰', title: 'Competitive Pay', desc: 'Industry-standard salaries with performance bonuses.' },
          ].map((item, i) => (
            <div key={i} className="info-card" style={{ textAlign: 'center', padding: '30px 24px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.emoji}</div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Careers;
