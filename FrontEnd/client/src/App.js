import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import SearchResult from './components/SearchResult';
import PopularTerms from './components/PopularTerms';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popularTerms, setPopularTerms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch the popular terms on component mount
  useEffect(() => {
    const fetchPopularTerms = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dictionary/popular');
        if (!response.ok) {
          throw new Error('Failed to fetch popular terms');
        }
        const data = await response.json();
        setPopularTerms(data.popularTerms);
      } catch (error) {
        console.error('Error fetching popular terms:', error);
      }
    };

    fetchPopularTerms();
  }, []);

  // Function to search for a word
  // Function to search for a word
const handleSearch = async (searchTerm) => {
  setLoading(true);
  setError(null);
  setDefinition(null);

  try {
    const response = await fetch(`http://localhost:3001/api/dictionary/search/${searchTerm}`);
    if (!response.ok) {
      throw new Error('Term not found');
    }
    const data = await response.json();
    setDefinition(data); // Store all definitions in state
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


  // Function to handle text-to-speech request
  const handleListen = async (term, definitionIndex) => {
    try {
      const response = await fetch(`http://localhost:3001/api/dictionary/text-to-speech/${term}/${definitionIndex}`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to generate text-to-speech');
      }
      const { audioUrl } = await response.json();
      console.log('Audio URL:', audioUrl); // Log the audio URL for debugging
      const audio = new Audio(audioUrl); // Play the returned audio URL
      audio.play();
    } catch (error) {
      console.error('Error generating text-to-speech:', error);
    }
  };
  
  

  return (
    <div className="App">
      <div className="App-content">
        <h1>Online English Dictionary</h1>
        <SearchForm onSearch={handleSearch} />
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {definition && definition.length > 0 && (
  <SearchResult 
    key={0}
    term={definition[0].term} 
    definition={definition[0].definition} 
    wordtype={definition[0].wordtype} 
    onSeeMore={() => setModalOpen(true)} 
    onListen={handleListen} 
    index={0} // Assuming you always want to listen to the first definition
  />
)}

        <PopularTerms terms={popularTerms} />
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
  <h2>Definitions for {definition ? definition[0].term : '...'}</h2>
  <div className="word-detail-container">
    {definition && definition.map((def, index) => (
      <div key={index} className="word-detail">
        <h3>{def.wordtype}</h3>
        <p>{def.definition}</p>
      </div>
    ))}
  </div>
</Modal>

    </div>
  );
}

export default App;
