import React from 'react';

export default function PageFade({ children, className = '' }) {
  return (
    <div className={`animate-page-fade ${className}`}>{children}</div>
  );
}
