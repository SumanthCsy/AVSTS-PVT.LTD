import React from 'react';
import { Calendar } from 'lucide-react';

// In a real app, this would be fetched from the backend API
const mockPosts = [
  {
    id: 1,
    title: "Summer AC Maintenance Camp",
    content: "Get your AC ready for the blazing summer! We are running a special maintenance camp this month. Book your slot now to ensure peak performance.",
    date: "10 May 2024",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Why Duct Cleaning is Essential",
    content: "Dirty ducts can circulate dust, pollen, and other allergens throughout your home. Learn how our professional duct cleaning service improves your indoor air quality.",
    date: "02 Apr 2024",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
  }
];

const Posts: React.FC = () => {
  return (
    <div className="container section-padding">
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Latest Updates</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Stay updated with the latest news, offers, and HVAC tips from AVSTS Projects.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
        {mockPosts.map((post) => (
          <div key={post.id} className="info-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '250px', width: '100%' }}>
              <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '30px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-color)', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 600 }}>
                <Calendar size={16} /> {post.date}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--text-main)' }}>{post.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flexGrow: 1 }}>{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
