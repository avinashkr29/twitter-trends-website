import React from 'react';

function FilterControls({ onSortChange, sortOption }) {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };
  
  return (
    <div className="filter-controls">
      <div className="sort-control">
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="latest">Latest</option>
          <option value="trending">Most Trending</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
}

export default FilterControls;
