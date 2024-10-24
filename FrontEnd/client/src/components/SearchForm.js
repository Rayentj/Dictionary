import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term) {
      onSearch(term); // Call the parent's search function
      setTerm(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search for a word"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
