// Updated src_components_TrendCard.js
import React from 'react';

function TrendCard({ trend }) {
  return (
    <div className="trend-card">
      <div className="trend-header">
        {trend.originalTopic && (
          <h3 className="original-topic" lang="ja">{trend.originalTopic}</h3>
        )}
        {trend.englishTranslation && (
          <h4 className="english-translation">{trend.englishTranslation}</h4>
        )}
      </div>
      <div className="trend-content">
        {trend.whyTrending && (
          <p className="why-trending"><strong>Why it's trending:</strong> {trend.whyTrending}</p>
        )}
        {trend.context && (
          <p className="context"><strong>Context:</strong> {trend.context}</p>
        )}
        {trend.imageUrl && (
          <div className="trend-image">
            <img src={trend.imageUrl} alt={trend.englishTranslation || trend.originalTopic} />
          </div>
        )}
        {trend.links && trend.links.length > 0 && (
          <div className="trend-links">
            <strong>Related Links:</strong>
            <ul>
              {trend.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title || link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {trend.tags && trend.tags.length > 0 && (
          <div className="trend-tags">
            {trend.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrendCard;