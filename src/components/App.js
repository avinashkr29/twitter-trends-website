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
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // In src_components_App.js
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
  }, [selectedCountry, refreshCounter]);  // Add refreshCounter to dependency array
  
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
  
  const handleRefreshData = (country) => {
    // Don't change the selectedCountry state here! Just clear cache and force reload
    setLoading(true);
    setError(null);
    
    // Clear the cached data for this specific country
    localStorage.removeItem(`twitter_trends_cache_${country}`);
    localStorage.removeItem(`twitter_trends_timestamp_${country}`);
    
    // Force reload by creating a temporary state update
    setRefreshCounter(prev => prev + 1); // Add this state if you don't have it
  };

  return (
    <div className="app">
      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        metadata={metadata}
        onRefreshData={handleRefreshData}
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