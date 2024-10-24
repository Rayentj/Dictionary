const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

// Route to search for a word
router.get('/search/:term', dictionaryController.searchTerm);

// Route to get popular terms
router.get('/popular', dictionaryController.getPopularTerms);

// New route for Text-to-Speech// routes/dictionaryRoutes.js
router.post('/text-to-speech/:term/:definitionIndex', dictionaryController.generateTextToSpeech);


module.exports = router;
