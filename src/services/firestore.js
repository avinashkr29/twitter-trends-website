import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { mockTrends } from '../mock/trendsData';

// Cache key for local storage
const CACHE_KEY = 'twitter_trends_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Set to true to use mock data instead of Firestore
const USE_MOCK_DATA = true;

export const fetchTrends = async () => {
  // Check cache first
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    // If cache is less than 24 hours old, use it
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
  }

  if (USE_MOCK_DATA) {
    // Return mock data for development
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: mockTrends,
      timestamp: Date.now()
    }));
    return mockTrends;
  }

  // Fetch from Firestore
  try {
    const trendsRef = collection(db, 'trends');
    const q = query(trendsRef, orderBy('timestamp', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    
    const trends = [];
    querySnapshot.forEach((doc) => {
      trends.push({ id: doc.id, ...doc.data() });
    });
    
    // Update cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: trends,
      timestamp: Date.now()
    }));
    
    return trends;
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};