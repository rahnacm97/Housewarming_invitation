import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft = {};

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false
      };

      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft(); // run initially
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isCompleted) {
    return (
      <div className="section-wrapper" style={{ marginTop: '2rem' }}>
        <h3 className="gold-text" style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
          "Home is where love resides, memories are created, friends always belong, and laughter never ends."
        </h3>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <div className="countdown-box glass-panel">
        <span className="countdown-num gold-text">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-box glass-panel">
        <span className="countdown-num gold-text">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-box glass-panel">
        <span className="countdown-num gold-text">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-box glass-panel">
        <span className="countdown-num gold-text">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
};

export default Countdown;
