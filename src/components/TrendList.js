import React from 'react';
import TrendCard from './TrendCard';

function TrendList({ trends }) {
  // Ensure trends is an array before trying to use .map()
  if (!trends || !Array.isArray(trends) || trends.length === 0) {
    return <div className="no-trends">No trends found matching your criteria.</div>;
  }
  
  return (
    <div className="trend-list">
      {trends.map(trend => (
        <TrendCard key={trend.id} trend={trend} />
      ))}
    </div>
  );
}

export default TrendList;