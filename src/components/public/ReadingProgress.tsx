import React, { useState, useEffect } from 'react';

export const ReadingProgress: React.FC = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-100/50">
      <div
        className="h-full bg-gradient-to-r from-[#0066CC] to-[#F7931E] transition-all duration-75"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
};
