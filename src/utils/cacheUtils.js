// Cache utility functions
export const setCacheItem = (key, data, expiryInMs = 24 * 60 * 60 * 1000) => {
  const item = {
    data,
    timestamp: Date.now(),
    expiry: expiryInMs
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCacheItem = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  const parsedItem = JSON.parse(item);
  if (Date.now() - parsedItem.timestamp > parsedItem.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  
  return parsedItem.data;
};

export const clearCache = (key) => {
  if (key) {
    localStorage.removeItem(key);
  } else {
    localStorage.clear();
  }
};
