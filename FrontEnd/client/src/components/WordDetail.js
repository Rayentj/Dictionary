// src/components/WordDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './WordDetail.css'; // Import CSS for styling if needed

const WordDetail = ({ definitions }) => {
  const { term } = useParams(); // Get the term from the URL

  // Filter definitions for the specific term
  const filteredDefinitions = definitions.filter(def => def.term === term);

  return (
    <div className="word-detail-container">
      <h2>Definitions for "{term}"</h2>
      {filteredDefinitions.length > 0 ? (
        <div className="definitions-list">
          {filteredDefinitions.map((def, index) => (
            <div key={index} className="definition-item">
              <h3>{def.wordtype}</h3>
              <p>{def.definition}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No definitions found for this term.</p>
      )}
    </div>
  );
};

export default WordDetail;
