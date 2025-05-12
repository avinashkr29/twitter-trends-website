
// import Papa from 'papaparse'; - Remove this line
import { mockTrends } from '../mock/trendsData';

// Base URL for your Firebase Storage files
// Update this constant to point to the JSON base URL if needed
const STORAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/what-is-trending-30e10.firebasestorage.app/o/trends%2F';
const STORAGE_URL_SUFFIX = '%2Flatest%2Flatest.json?alt=media';

// Cache keys
const CACHE_KEY_PREFIX = 'twitter_trends_cache_';
const CACHE_TIMESTAMP_KEY_PREFIX = 'twitter_trends_timestamp_';
const CACHE_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours

// Get the JSON URL instead of CSV
// Update the getTrendsJsonUrl function to use a CORS proxy
// Get the JSON URL for a specific country
const getTrendsJsonUrl = (country = 'worldwide') => {
  // Direct URL to the JSON file
  const originalUrl = `${STORAGE_BASE_URL}${country}${STORAGE_URL_SUFFIX}`;
  
  // More reliable CORS proxy - Note that this is still not ideal for production
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
};

// Function to parse JSON data to structured format
const parseJsonToTrends = (jsonData) => {
  // Make sure the data is an array before using it
  if (!Array.isArray(jsonData)) {
    console.error('JSON data is not an array:', jsonData);
    return [];
  }
  
  // Filter out any entries that aren't valid trend data
  // (like the last entry which is a note about the data)
  const validTrends = jsonData.filter(item => 
    item["Original Topic/Hashtag (combined)"] && 
    item["Original Topic/Hashtag (combined)"].length > 0 && 
    typeof item["Original Topic/Hashtag (combined)"] === "string"
  );
  
  // Map JSON data to our trends format with correct field names
  return validTrends.map((item, index) => ({
    id: `trend-${index + 1}`,
    originalTopic: item["Original Topic/Hashtag (combined)"],
    englishTranslation: item["English Translation"],
    whyTrending: item["Why is it trending now?"],
    context: item["Detailed context and background"],
    timestamp: new Date().getTime(),
    trendScore: 90 + Math.floor(Math.random() * 10) // Random score between 90-99
  }));
};

// Main function to fetch trends with added country parameter
export const fetchTrends = async (country = 'worldwide') => {
  const CACHE_KEY = `${CACHE_KEY_PREFIX}${country}`;
  const CACHE_TIMESTAMP_KEY = `${CACHE_TIMESTAMP_KEY_PREFIX}${country}`;
  
  const now = Date.now();
  const lastFetch = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  
  // Check if we have recent cached data for this country
  if (lastFetch && now - parseInt(lastFetch) < CACHE_EXPIRY) {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          console.log(`Using cached data for ${country}`, parsedData.length + ' trends found');
          return parsedData;
        } else {
          console.error('Cached data is not an array:', parsedData);
        }
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }
  }
  
  try {
    // Fetch JSON from Firebase Storage for the selected country
    const jsonUrl = getTrendsJsonUrl(country);
    console.log(`Attempting to fetch from URL for ${country}:`, jsonUrl);
    
    const response = await fetch(jsonUrl);
    
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trends data: ${response.status}`);
    }
    
    // Parse the response as JSON instead of text
    const jsonData = await response.json();
    console.log('JSON data retrieved, item count:', jsonData.length);
    
    const trends = parseJsonToTrends(jsonData);
    console.log('Parsed trends count:', trends.length);
    
    // Make sure we're returning an array
    if (!Array.isArray(trends)) {
      console.error('Parsed trends is not an array, returning mock data instead');
      return mockTrends;
    }
    
    // Cache the results
    localStorage.setItem(CACHE_KEY, JSON.stringify(trends));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
    
    return trends;
  } catch (error) {
    console.error(`Error fetching trends for ${country}:`, error);
    
    // Fall back to cached data if available
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          console.log('Falling back to cached data after error');
          return parsedData;
        }
      } catch (e) {
        console.error('Error parsing fallback cached data:', e);
      }
    }
    
    // If no cached data, use mock data as last resort
    console.warn('Using mock data as fallback');
    return mockTrends;
  }
};