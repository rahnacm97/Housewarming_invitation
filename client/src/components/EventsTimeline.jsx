import React from 'react';
import { Sparkles, Flame, Utensils, Coffee, Clock } from 'lucide-react';

const getTimelineIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('pooja') || lowerTitle.includes('puja') || lowerTitle.includes('entry')) {
    return <Sparkles size={18} />;
  }
  if (lowerTitle.includes('havan') || lowerTitle.includes('fire') || lowerTitle.includes('prayer')) {
    return <Flame size={18} />;
  }
  if (lowerTitle.includes('lunch') || lowerTitle.includes('dinner') || lowerTitle.includes('food')) {
    return <Utensils size={18} />;
  }
  if (lowerTitle.includes('tea') || lowerTitle.includes('coffee') || lowerTitle.includes('tour')) {
    return <Coffee size={18} />;
  }
  return <Clock size={18} />;
};

const EventsTimeline = ({ events }) => {
  return (
    <div className="timeline-wrapper">
      {events.map((event, index) => (
        <div className="timeline-item" key={index}>
          <div className="timeline-badge">
            {getTimelineIcon(event.title)}
          </div>
          
          <div className="timeline-time">{event.time}</div>
          
          <div className="timeline-content glass-panel">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsTimeline;
