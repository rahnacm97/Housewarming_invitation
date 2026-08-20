import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from './config';
import CoverGate from './components/CoverGate';
import Countdown from './components/Countdown';
import EventsTimeline from './components/EventsTimeline';
import RsvpForm from './components/RsvpForm';
import WishesWall from './components/WishesWall';
import MusicPlayer from './components/MusicPlayer';
import AdminDashboard from './components/AdminDashboard';
import { Calendar, MapPin, Clock, Phone } from 'lucide-react';

function App() {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const wishesWallRef = useRef(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Synchronize route paths
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if cover was already opened in this session
  useEffect(() => {
    const opened = sessionStorage.getItem('cover_opened') === 'true';
    if (opened) {
      setIsCoverOpen(true);
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setMusicPlaying(true);
    sessionStorage.setItem('cover_opened', 'true');
  };

  const handleRsvpSuccess = () => {
    if (wishesWallRef.current) {
      wishesWallRef.current.refreshWishes();
    }
  };

  // Simple router check for Admin panel
  if (currentPath === '/admin') {
    return (
      <div className="app-container">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Landing Cover Screen */}
      <CoverGate
        isOpen={isCoverOpen}
        onOpen={handleOpenInvitation}
        hosts={CONFIG.hosts}
        houseName={CONFIG.houseName}
      />

      {/* Main Invitation Card */}
      <main className={`main-invitation ${isCoverOpen ? 'reveal' : ''}`}>
        
        {/* Welcome Section */}
        <section className="invitation-header">
          <span className="badge">You are Cordially Invited</span>
          <h2>Griha Pravesh & House Warming</h2>
          <h3>at {CONFIG.houseName}</h3>
          <p className="greeting-text">
            “With the grace of God and the blessings of our elders, we have built the home of our dreams. 
            A space filled with love, laughter, and memories waiting to be made. We request the pleasure 
            of your company to bless our new nest and celebrate this beautiful new beginning with us.”
          </p>
        </section>

        {/* Countdown Section */}
        <section className="section-wrapper">
          <h2 className="section-title">The Countdown</h2>
          <Countdown targetDate={CONFIG.countdownDate} />
        </section>

        {/* Date & Time Summary Card */}
        <section className="section-wrapper">
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '650px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ color: 'var(--color-gold)' }}><Calendar size={28} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Date</div>
                <div style={{ fontWeight: 600 }}>{CONFIG.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ color: 'var(--color-gold)' }}><Clock size={28} /></div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Timing</div>
                <div style={{ fontWeight: 600 }}>09:00 AM onwards</div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Program Schedule */}
        <section className="section-wrapper">
          <h2 className="section-title">Ceremony Schedule</h2>
          <EventsTimeline events={CONFIG.timeline} />
        </section>

        {/* Venue & Location Map */}
        <section className="section-wrapper">
          <h2 className="section-title">Venue & Location</h2>
          <div className="venue-card glass-panel">
            <div className="venue-icon-wrapper">
              <MapPin size={36} />
            </div>
            <h3>{CONFIG.houseName}</h3>
            <p className="venue-address">
              {CONFIG.venueName},<br />
              {CONFIG.venueCity}
            </p>
            <a
              href={CONFIG.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-btn"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Get Directions
            </a>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="section-wrapper">
          <h2 className="section-title">Will You Join Us?</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Please RSVP by August 10, 2026, to help us make necessary arrangements.
          </p>
          <RsvpForm onRsvpSuccess={handleRsvpSuccess} />
        </section>

        {/* Messages / Blessings Wall */}
        <section className="section-wrapper">
          <h2 className="section-title">Wishes & Blessings</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '0.95rem' }}>
            Sweet messages left by our family and friends.
          </p>
          <WishesWall ref={wishesWallRef} />
        </section>

        {/* Footer Contact Details */}
        <footer style={{ marginTop: '8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem', textAlign: 'center', opacity: 0.7 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
            Need help or have questions?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Phone size={14} style={{ color: 'var(--color-gold)' }} />
              <span>{CONFIG.contactDetails.phone1}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Phone size={14} style={{ color: 'var(--color-gold)' }} />
              <span>{CONFIG.contactDetails.phone2}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            We look forward to welcoming you to our new home!
          </p>
        </footer>

        {/* Floating background music button */}
        <MusicPlayer
          shouldPlay={musicPlaying}
          triggerPlay={setMusicPlaying}
        />
      </main>
    </div>
  );
}

export default App;
