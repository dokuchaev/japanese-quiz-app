// src/components/ThemeToggle.jsx

import React, { useEffect, useState } from 'react';
import '../ThemeToggle.css';
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      onClick={toggleTheme}
     className="theme-toggle"
      style={{backgroundColor: theme === 'light' ? '#ddd' : '#333',}}
    >
      <div
          className="theme-toggle-btn"
        style={{
            transform: theme === 'light' ? 'translateX(0)': 'translateX(36px)',
          backgroundColor: theme === 'light' ? '#fff' : '#000',
            color: theme === 'light' ? '#000' : '#fff',
        }}
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </div>
    </div>
  );
};

export default ThemeToggle;
