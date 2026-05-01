import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Fan, Wrench, PenTool, ThermometerSnowflake } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Fade in logo
    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Fade in tagline
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    // Stagger in icons
    if (iconsRef.current) {
      tl.fromTo(
        iconsRef.current.children,
        { opacity: 0, x: -50, scale: 0.5 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      );
    }

    // Fade out everything at the end
    tl.to(
      containerRef.current,
      { opacity: 0, duration: 0.8, delay: 0.5, ease: 'power2.inOut' }
    );

  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div className="splash-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          ref={logoRef}
          src="/logo.png" 
          alt="AVSTS Projects Logo" 
          style={{ height: '180px', marginBottom: '24px', objectFit: 'contain' }}
        />
        <p 
          ref={taglineRef} 
          style={{ fontSize: '1.2rem', color: 'var(--primary-blue)', marginBottom: '40px' }}
        >
          Professional HVAC & A/C Services
        </p>
        
        <div 
          ref={iconsRef} 
          style={{ display: 'flex', gap: '30px', color: 'var(--accent-cyan)' }}
        >
          <div style={{ background: 'rgba(0,223,216,0.1)', padding: '16px', borderRadius: '50%' }}>
            <Fan size={40} />
          </div>
          <div style={{ background: 'rgba(0,112,243,0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-blue)' }}>
            <Wrench size={40} />
          </div>
          <div style={{ background: 'rgba(0,223,216,0.1)', padding: '16px', borderRadius: '50%' }}>
            <PenTool size={40} />
          </div>
          <div style={{ background: 'rgba(0,112,243,0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-blue)' }}>
            <ThermometerSnowflake size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
