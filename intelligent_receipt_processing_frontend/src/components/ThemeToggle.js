import React from 'react';

// PUBLIC_INTERFACE
export function ThemeToggle({ theme, onToggle }) {
  /** Button to toggle between light and dark themes. */
  return (
    <button className="btn" onClick={onToggle} aria-label="Toggle theme">
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
export default ThemeToggle;
