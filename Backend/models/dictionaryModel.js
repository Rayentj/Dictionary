const fs = require('fs');
const path = require('path');

let dictionary = [];

// Load the JSON data once at the start of the server
const loadDictionary = () => {
  const filePath = path.join(__dirname, '../data/englishdictionary.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the data as an array of objects
    dictionary = JSON.parse(data);
    
    // Log the first few entries to verify
    console.log('Sample of dictionary:', dictionary.slice(0, 5));
  } catch (error) {
    console.error('Error loading dictionary:', error);
  }
};

// Search for a word in the dictionary
const searchWord = (term) => {
    const word = term.toLowerCase();
    
    // Check if dictionary is defined and has entries
    if (!Array.isArray(dictionary) || dictionary.length === 0) {
      console.error('Dictionary is empty or not an array');
      return null; // Return null or handle error as needed
    }
    
    // Find all entries that match the search term
    const results = dictionary.filter(entry => {
      // Ensure entry.word exists before calling toLowerCase
      return entry.word && entry.word.toLowerCase() === word;
    });
  
    if (results.length > 0) {
      return results.map(result => ({
        term: result.word,
        definition: result.definition,
        wordtype: result.wordtype
      }));
    }
    return null; // Return null if no result is found
  };
  

// Export functions
module.exports = {
  loadDictionary,
  searchWord,
};
