// src_components_App.js
import React, { useState, useEffect } from 'react';
import { fetchTrends } from '../services/trendsService';
import Header from './Header';
import SearchBar from './SearchBar';
import FilterControls from './FilterControls';
import TrendList from './TrendList';

function App() {
  const [trends, setTrends] = useState([]);
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [metadata, setMetadata] = useState(null);
  
  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true);
        const { trends, metadata } = await fetchTrends(selectedCountry);
        setTrends(trends);
        setFilteredTrends(trends);
        setMetadata(metadata);
      } catch (err) {
        setError('Failed to load trends. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTrends();
  }, [selectedCountry]);  // Re-fetch when country changes
  
  useEffect(() => {
    // Apply search and sort whenever these change
    let result = [...trends];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(trend => 
        trend.originalTopic?.toLowerCase().includes(term) || 
        trend.englishTranslation?.toLowerCase().includes(term) || 
        trend.whyTrending?.toLowerCase().includes(term) ||
        trend.context?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (sortOption === 'latest') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortOption === 'trending') {
      result.sort((a, b) => b.trendScore - a.trendScore);
    } else if (sortOption === 'alphabetical') {
      result.sort((a, b) => a.englishTranslation?.localeCompare(b.englishTranslation || ''));
    }
    
    setFilteredTrends(result);
  }, [trends, searchTerm, sortOption]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };
  
  return (
    <div className="app">
      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        metadata={metadata}
      />
      <div className="container">
        <div className="controls">
          <SearchBar onSearch={handleSearch} />
          <FilterControls onSortChange={handleSortChange} sortOption={sortOption} />
        </div>
        
        {loading ? (
          <div className="loading">Loading trends...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <TrendList trends={filteredTrends} />
        )}
      </div>
    </div>
  );
}

export default App;