import React, { useState } from 'react';
import { CONFIG } from '../config';

const RsvpForm = ({ onRsvpSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    attending: 'true', // string for binding, convert to boolean on submit
    guests: '1',
    wish: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Validate phone length
    if (formData.phone.trim().length < 8) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${CONFIG.apiBaseUrl}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          attending: formData.attending === 'true',
          guests: formData.attending === 'true' ? parseInt(formData.guests) : 0
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: formData.attending === 'true'
            ? 'Thank you! We can’t wait to celebrate with you!'
            : 'Thank you for letting us know. We will miss you!'
        });
        
        // Reset form except phone (so they can see what they submitted)
        setFormData({
          name: '',
          phone: '',
          email: '',
          attending: 'true',
          guests: '1',
          wish: ''
        });

        // Trigger wishes wall refresh
        if (onRsvpSuccess) {
          onRsvpSuccess();
        }
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('RSVP submit error:', error);
      setStatus({ type: 'error', message: 'Network error. Could not connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rsvp-card glass-panel">
      <form onSubmit={handleSubmit} className="rsvp-form">
        <div className="form-group">
          <label htmlFor="name">Your Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address (Optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Will you attend? *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="attending"
                value="true"
                checked={formData.attending === 'true'}
                onChange={handleChange}
              />
              <span className="radio-custom">Yes, with pleasure!</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="attending"
                value="false"
                checked={formData.attending === 'false'}
                onChange={handleChange}
              />
              <span className="radio-custom">Regretfully, no</span>
            </label>
          </div>
        </div>

        {formData.attending === 'true' && (
          <div className="form-group" style={{ animation: 'hover-float 0s' }}>
            <label htmlFor="guests">Number of Guests</label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="form-input"
              style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
            >
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4 People</option>
              <option value="5">5+ People</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="wish">Send Blessings / Message</label>
          <textarea
            id="wish"
            name="wish"
            rows="3"
            maxLength="500"
            placeholder="Write a sweet message or blessings for our new home..."
            value={formData.wish}
            onChange={handleChange}
            className="form-input"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        {status.message && (
          <div className={`submit-status-msg ${status.type}`}>
            {status.message}
          </div>
        )}

        <button type="submit" className="gold-btn" disabled={loading} style={{ alignSelf: 'center', width: '100%', marginTop: '1rem' }}>
          {loading ? 'Submitting...' : 'Send RSVP'}
        </button>
      </form>
    </div>
  );
};

export default RsvpForm;
