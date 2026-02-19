import React from 'react';

const GRADIENT_MAP = {
  'Web Development': 'var(--lh-gradient-indigo)',
  'Programming': 'var(--lh-gradient-blue)',
  'Data Science': 'var(--lh-gradient-orange)',
  'Design': 'var(--lh-gradient-pink)',
  'Default': 'var(--lh-gradient-hero)',
};

const getInitials = (title) => {
  const words = title.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.substring(0, 2).toUpperCase();
};

export default function CourseLogo({ course, size = 80 }) {
  const gradient = GRADIENT_MAP[course?.category] || GRADIENT_MAP.Default;
  const initials = getInitials(course?.title || 'CO');
  
  return (
    <div 
      className="course-logo"
      style={{
        width: size,
        height: size,
        background: gradient,
        color: 'white',
        fontSize: `${size * 0.3}px`,
        fontWeight: 800,
        borderRadius: 'var(--radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {initials}
    </div>
  );
}
