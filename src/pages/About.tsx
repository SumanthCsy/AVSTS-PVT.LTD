import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container section-padding">
      <div className="info-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '50px' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center', fontSize: '2.5rem' }}>About Us</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <p>
            <strong>AVSTS PROJECTS PRIVATE LIMITED (CIN: U52335TG2022PTC168286)</strong> is a Private company incorporated on 15 Dec 2022. It is classified as Non-government company and is registered at Registrar of Companies, Hyderabad. Its authorized share capital is Rs. 100000.00 and its paid up capital is Rs. 100000.00.
          </p>

          <p>
            AVSTS PROJECTS PRIVATE LIMITED's Annual General Meeting (AGM) was last held on 30 Dec 2023, and as per records from Ministry of Corporate Affairs (MCA), its balance sheet was last filed on 2023-03-31. AVSTS PROJECTS PRIVATE LIMITED's NIC code is 5233 (which is part of its CIN). As per the NIC code, it is involved in Retail sale of household appliances, articles and equipment.
          </p>

          <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', margin: '10px 0' }}>
            <p style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '8px' }}>Directors:</p>
            <p>SAMPATH NOONE, and ANITHA NOONE.</p>
          </div>

          <p>
            AVSTS PROJECTS PRIVATE LIMITED's Corporate Identification Number (CIN) is U52335TG2022PTC168286 and its registration number is 168286. 
          </p>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Contact Information</h3>
            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> avsts.projects@gmail.com</p>
            <p>
              <strong>Registered Address:</strong><br/>
              UG-07, UG Floor, DSL Abacus IT Park,<br/>
              Beside DSL Virtue Mall, Uppal Khalsa Village,<br/>
              IDA Uppal, HYDERABAD, Telangana, India - 500039.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
