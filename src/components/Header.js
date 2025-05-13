// src_components_Header.js
import React, { useState, useEffect } from 'react';

function Header({ selectedCountry, onCountryChange, metadata, onRefreshData }) {
  const [lastRefreshTime, setLastRefreshTime] = useState('');
  const [sourceTime, setSourceTime] = useState('');
  
  useEffect(() => {
    // Function to update the displayed timestamps
    const updateTimestamps = () => {
      const timestamp = localStorage.getItem(`twitter_trends_cache_${selectedCountry}_readable`);
      setLastRefreshTime(timestamp || 'Never');
      
      // Try to get metadata timestamp from localStorage
      const metadataKey = `twitter_trends_metadata_${selectedCountry}`;
      const storedMetadata = localStorage.getItem(metadataKey);
      
      if (storedMetadata) {
        try {
          const parsedMetadata = JSON.parse(storedMetadata);
          if (parsedMetadata && parsedMetadata.timestamp) {
            const metadataDate = new Date(parsedMetadata.timestamp);
            setSourceTime(metadataDate.toLocaleString());
          } else {
            setSourceTime('Unknown');
          }
        } catch (e) {
          console.error('Error parsing metadata:', e);
          setSourceTime('Unknown');
        }
      } else {
        setSourceTime('Unknown');
      }
    };
    
    // Set initially
    updateTimestamps();
    
    // Set up a timer to check periodically (every 5 seconds)
    const timer = setInterval(updateTimestamps, 5000);
    
    // Clean up on unmount
    return () => clearInterval(timer);
  }, [selectedCountry, metadata]);
  
  const handleReset = () => {
    // Remove cache for ONLY the selected country
    localStorage.removeItem(`twitter_trends_cache_${selectedCountry}`);
    localStorage.removeItem(`twitter_trends_timestamp_${selectedCountry}`);
    localStorage.removeItem(`twitter_trends_metadata_${selectedCountry}`);
    
    // Call onRefreshData with the currently selected country
    onRefreshData(selectedCountry);
  };
  
  return (
    <header className="header">
      <div className="container">
        <h1>What is Trending?</h1>
        <div className="refresh-info">
          <span>Last fetched: {lastRefreshTime}</span>
          {sourceTime && (
            <div className="source-time">
              <span>Data timestamp: {sourceTime}</span>
            </div>
          )}
        </div>
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