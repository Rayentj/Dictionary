const express = require('express');
const app = express();
const dictionaryRoutes = require('./routes/dictionaryRoutes');
const dictionaryModel = require('./models/dictionaryModel');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors');

app.use(cors());

// Create a client for the Text-to-Speech API
const client = new textToSpeech.TextToSpeechClient();

const PORT = 3001;

// Middleware to handle JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS

// Load the dictionary when the server starts
dictionaryModel.loadDictionary();

// Use the dictionary routes
app.use('/api/dictionary', dictionaryRoutes);

// New route for Text-to-Speech
app.post('/api/text-to-speech', async (req, res) => {
    const { text } = req.body; // Get the text from the request body

    // Prepare the request for the Text-to-Speech API
    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        // Perform the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);

        // Save the audio file to the server
        const audioFileName = 'output.mp3'; // Change as needed
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
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
