import React from 'react';
import { Home } from 'lucide-react';

const CoverGate = ({ isOpen, onOpen, hosts, houseName }) => {
  return (
    <div className={`cover-gate ${isOpen ? 'fade-out' : ''}`}>
      <div className="cover-gate-decor">
        {/* Lucide Home icon customized to look golden and premium */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--color-gold)',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.05)',
        }}>
          <Home size={48} className="gold-text" style={{ strokeWidth: 1.5 }} />
        </div>
      </div>
      
      <h2>You are Invited</h2>
      <h1 className="gold-text" style={{ margin: '1rem 0 2rem' }}>
        Griha Pravesh &<br />House Warming
      </h1>
      
      <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        Celebration of our new home
      </p>
      <p className="gold-text" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '3rem' }}>
        {houseName}
      </p>
      
      <button className="gold-btn" onClick={onOpen}>
        Open Invitation
      </button>
      
      <div style={{ marginTop: '4rem', opacity: 0.5, fontSize: '0.75rem', letterSpacing: '1px' }}>
        Hosted by: {hosts}
      </div>
    </div>
  );
};

export default CoverGate;
