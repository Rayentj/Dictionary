const dictionaryModel = require('../models/dictionaryModel');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

// Memory store for popular searches
let popularSearches = {};  // Object to store word search counts
const MAX_POPULAR_TERMS = 10;

// Create a client for the Text-to-Speech API
const client = new textToSpeech.TextToSpeechClient();

// Search for a word and return its definition
const searchTerm = (req, res) => {
    const term = req.params.term.toLowerCase();
    const result = dictionaryModel.searchWord(term);

    if (result) {
        // Update popular search terms
        if (popularSearches[term]) {
            popularSearches[term]++;
        } else {
            popularSearches[term] = 1;
        }
        return res.status(200).json(result);
    }

    return res.status(404).json({ error: 'Term not found' });
};

// Return the top 10 popular search terms and their counts
const getPopularTerms = (req, res) => {
    const popularArray = Object.keys(popularSearches)
        .map((word) => ({ word, count: popularSearches[word] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_POPULAR_TERMS);

    res.status(200).json({ popularTerms: popularArray });
};

// Rename the TTS function to avoid naming conflict
const generateTextToSpeech = async (req, res) => {
  const term = req.params.term.toLowerCase(); // Extract term from URL parameters
  const definitionIndex = parseInt(req.params.definitionIndex, 10); // Extract the definition index

  // Check if term is provided and definitionIndex is valid
  if (!term || isNaN(definitionIndex)) {
      return res.status(400).json({ error: 'Term and valid definition index are required' });
  }

  // Search for the term in the dictionary
  const results = dictionaryModel.searchWord(term);

  // Ensure results are valid and the definition index is within bounds
  if (results && results.length > definitionIndex && definitionIndex >= 0) {
      // Get the specific definition by index
      const selectedDefinition = results[definitionIndex].definition;

      // Prepare the text-to-speech request using the selected definition
      const request = {
          input: { text: selectedDefinition },
          voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
          audioConfig: { audioEncoding: 'MP3' },
      };

      try {
          // Perform the Text-to-Speech request
          const [response] = await client.synthesizeSpeech(request);

          // Save the audio file to the server
          const audioFileName = `output_${term}_${definitionIndex}.mp3`;
          await util.promisify(fs.writeFile)(audioFileName, response.audioContent, 'binary');

          // Send the audio file as a response
          res.download(audioFileName, () => {
              // Optionally delete the file after sending
              fs.unlink(audioFileName, (err) => {
                  if (err) console.error('Failed to delete file:', err);
              });
          });
      } catch (error) {
          console.error('Error synthesizing speech:', error);
          res.status(500).send('Error synthesizing speech');
      }
  } else {
      return res.status(404).json({ error: 'Definition not found or invalid definition index' });
  }
};





module.exports = {
    searchTerm,
    getPopularTerms,
    generateTextToSpeech, // Update the export for the new TTS function
};
