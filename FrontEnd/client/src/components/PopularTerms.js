import React from 'react';

function PopularTerms({ terms }) {
  return (
    <div>
      <h2>Top 10 Popular Search Terms</h2>
      <ul>
        {terms.map((term, index) => (
          <li key={index}>
            {term.word} - Searched {term.count} times
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularTerms;
