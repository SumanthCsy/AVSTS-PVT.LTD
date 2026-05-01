import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, ShieldCheck, Clock, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, UPLOADS_URL } from '../utils/api';


const servicesList = [
  { title: 'A/C System Maintenance', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { title: 'A/C System Repair', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80' },
  { title: 'Heating System Installation', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
  { title: 'Heating System Maintenance', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { title: 'Heating System Repair', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80' },
  { title: 'HVAC System Maintenance', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
  { title: 'AC Installation', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { title: 'HVAC Repair', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80' },
  { title: 'Ductless Heating & A/C', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
  { title: 'HVAC Duct & Vent Cleaning', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { title: 'HVAC Duct & Vent Installation', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80' },
  { title: 'HVAC Duct & Vent Repair', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80' },
  { title: 'Thermostat Installation', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
  { title: 'Thermostat Repair', img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80' },
];

const Home: React.FC = () => {
  const mockSlides = [
    { id: 1, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200', title: 'Professional A/C Repair' },
    { id: 2, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200', title: 'Expert HVAC Installation' },
    { id: 3, image: 'https://images.unsplash.com/photo-1595814436015-91f1b2602899?auto=format&fit=crop&q=80&w=1200', title: '24/7 Emergency Maintenance' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(mockSlides);
  const [posts, setPosts] = useState<any[]>([]);
  const slideRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Read animation preference from local storage or default to left-to-right
  const animType = localStorage.getItem('avsts_slide_anim') || 'slideLeftToRight';

  useEffect(() => {
    // Fetch live slideshows
    fetch(`${API_URL}/slideshows`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data.map((d: any) => ({ 
            ...d, 
            image: `${UPLOADS_URL}${d.image}`,
            title: d.title || '' 
          })));
        }
      })
      .catch(console.error);

    // Fetch live posts
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Header Animation
    gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });

    // Slideshow Animation
    const interval = setInterval(() => {
      const el = slideRef.current;
      const nextIndex = (currentSlide + 1) % slides.length;
      const nextSlide = slides[nextIndex];
      const animStyle = nextSlide?.animation || animType; // Use slide-specific anim or global default
      
      let outProps = {};
      let inProps = {};

      if (animStyle === 'fade') {
        outProps = { opacity: 0, duration: 0.5 };
        inProps = { opacity: 1, duration: 0.5 };
      } else if (animStyle === 'left') {
        outProps = { x: '100%', opacity: 0, duration: 0.5 };
        inProps = { x: '0%', opacity: 1, duration: 0.5 };
      } else if (animStyle === 'right') {
        outProps = { x: '-100%', opacity: 0, duration: 0.5 };
        inProps = { x: '0%', opacity: 1, duration: 0.5 };
      } else if (animStyle === 'flip') {
        outProps = { rotationY: 90, opacity: 0, duration: 0.5, transformPerspective: 1000 };
        inProps = { rotationY: 0, opacity: 1, duration: 0.5, transformPerspective: 1000 };
      } else {
        // Fallback for slideLeftToRight legacy key
        outProps = { x: '100%', opacity: 0, duration: 0.5 };
        inProps = { x: '0%', opacity: 1, duration: 0.5 };
      }

      gsap.to(el, { 
        ...outProps,
        onComplete: () => {
          setCurrentSlide(nextIndex);
          gsap.fromTo(el, { ...outProps, x: animStyle === 'left' ? '-100%' : (animStyle === 'right' ? '100%' : 0) }, { ...inProps });
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [animType]);

  return (
    <div>
      {/* Company Name & Title */}
      <section className="container" style={{ paddingTop: '40px', paddingBottom: '40px', textAlign: 'center' }} ref={headerRef}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
          AVSTS PROJECTS PRIVATE LIMITED
        </h2>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.2', color: 'var(--primary-color)' }}>
          Reliable HVAC & Air Conditioning Services
        </h1>
        <p style={{ marginTop: '20px', fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '20px auto 0' }}>
          Professional installation, repair, and maintenance for your cooling and heating systems.
        </p>
      </section>

      {/* Slideshow — Card style, desktop max-width */}
      <section className="container" style={{ paddingBottom: '80px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '12px',
            boxShadow: '0 20px 60px rgba(0,86,179,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid rgba(200,220,255,0.4)'
          }}>
            {/* Faux window dots */}
            <div style={{ display: 'flex', gap: '6px', padding: '4px 8px 10px', alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
            </div>
            {/* 16:9 image area */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '14px', overflow: 'hidden' }}>
              <img
                ref={slideRef}
                src={slides[currentSlide]?.image}
                alt="Slideshow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Gradient overlay + title */}
              {slides[currentSlide]?.title && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                  <h3 style={{ color: '#fff', fontSize: 'clamp(0.9rem, 2vw, 1.4rem)', margin: 0 }}>{slides[currentSlide].title}</h3>
                </div>
              )}
              {/* Dot indicators */}
              <div style={{ position: 'absolute', bottom: '12px', right: '16px', display: 'flex', gap: '6px' }}>
                {slides.map((_: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{ width: i === currentSlide ? '20px' : '7px', height: '7px', borderRadius: '4px', background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards with Features */}
      <section className="container section-padding">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { icon: <Award size={40} />, title: '1000+ Projects', desc: 'Successfully completed across locations.' },
            { icon: <ShieldCheck size={40} />, title: 'Quality Guarantee', desc: '100% satisfaction on all our services.' },
            { icon: <Clock size={40} />, title: '24/7 Support', desc: 'Round-the-clock emergency assistance.' },
            { icon: <Users size={40} />, title: 'Expert Team', desc: 'Highly trained & certified mechanics.' },
          ].map((feature, i) => (
            <div key={i} className="info-card" style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--secondary-color)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container section-padding">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem' }}>Our Services</h2>
            <p style={{ color: 'var(--text-muted)' }}>Scroll horizontally to see all our professional services.</p>
          </div>
          <Link to="/services" className="btn-outline desktop-only">View All Services</Link>
        </div>

        <div className="horizontal-scroll">
          {servicesList.map((service, index) => (
            <div key={index} className="scroll-item info-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '200px', width: '100%' }}>
                <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-main)' }}>{service.title}</h3>
                <Link to="/book" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Book Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mobile-only" style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/services" className="btn-outline">View All Services</Link>
        </div>
      </section>

      {/* Latest Posts Section */}
      {posts.length > 0 && (
        <section className="container section-padding">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Latest Updates</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {posts.map(post => (
              <div key={post.id} className="info-card" style={{ padding: 0, overflow: 'hidden' }}>
                {post.image && <img src={`${UPLOADS_URL}${post.image}`} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                <div style={{ padding: '24px' }}>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>{post.date}</p>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{post.title}</h3>
                  <div 
                    className="rich-content" 
                    style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxHeight: '100px', overflow: 'hidden' }} 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Us Redirect */}
      <section className="container section-padding" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Who We Are</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px' }}>
          We are a private company incorporated in Hyderabad, dedicated to delivering premium HVAC solutions.
        </p>
        <Link to="/about" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
          Read About Us
        </Link>
      </section>
    </div>
  );
};

export default Home;
