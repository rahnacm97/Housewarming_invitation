import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CONFIG } from '../config';

const WishesWall = forwardRef((props, ref) => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishes = async () => {
    try {
      const response = await fetch(`${CONFIG.apiBaseUrl}/rsvp/wishes`);
      const data = await response.json();
      if (data.success) {
        setWishes(data.data);
      }
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchWishes to parent component via ref so it can be re-run after RSVP submit
  useImperativeHandle(ref, () => ({
    refreshWishes: () => {
      fetchWishes();
    }
  }));

  useEffect(() => {
    fetchWishes();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading blessings...</div>;
  }

  if (wishes.length === 0) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
        No blessings left yet. Be the first to leave a message using the RSVP form!
      </div>
    );
  }

  return (
    <div className="wishes-grid">
      {wishes.map((wish) => (
        <div key={wish._id} className="wish-card glass-panel">
          <p className="wish-text">“{wish.wish}”</p>
          <div className="wish-author-meta">
            <div className="wish-author">{wish.name}</div>
            <div className="wish-date">{formatDate(wish.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default WishesWall;
