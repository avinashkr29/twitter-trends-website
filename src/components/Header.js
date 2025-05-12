// src_components_Header.js
import React from 'react';

function Header({ selectedCountry, onCountryChange }) {
  const handleReset = () => {
    localStorage.removeItem('twitter_trends_cache');
    localStorage.removeItem('twitter_trends_timestamp');
    window.location.reload();
  };
  
  return (
    <header className="header">
      <div className="container">
        <h1>Twitter Trends Japan</h1>
        <div className="controls-right">
          <div className="country-selector">
            <select 
              value={selectedCountry} 
              onChange={(e) => onCountryChange(e.target.value)}
            >
              <option value="worldwide">Worldwide</option>
              <option value="japan">Japan</option>
              <option value="us">US</option>
            </select>
          </div>
          <div className="language-toggle">
            <button className="active">EN</button>
            <button>JP</button>
          </div>
          <button onClick={handleReset} className="reset-button">Refresh Data</button>
        </div>
      </div>
    </header>
  );
}

export default Header;