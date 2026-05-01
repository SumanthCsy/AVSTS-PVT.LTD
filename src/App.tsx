import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import CheckStatus from './pages/CheckStatus';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Enquiry from './pages/Enquiry';
import Posts from './pages/Posts';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Careers from './pages/Careers';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('avsts_theme') || 'theme1';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Simulate loading time for the splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      <Navbar />
      <div style={{ paddingTop: '100px', minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/status" element={<CheckStatus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
