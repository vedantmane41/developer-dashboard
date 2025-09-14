const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- START OF FIX ---
// Configure CORS to allow requests specifically from your live frontend URL.
const corsOptions = {
  origin: 'https://developer-dashboard-11.onrender.com',
  optionsSuccessStatus: 200 // for some legacy browsers
};

// Use the configured CORS options
app.use(cors(corsOptions));
// --- END OF FIX ---


// --- API ROUTES ---

// 1. GitHub Profile and Repositories Route
app.get('/api/github/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const token = process.env.GITHUB_TOKEN;

        const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=10&sort=pushed`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = {
            user: userResponse.data,
            repos: reposResponse.data
        };

        res.json(data);

    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ message: 'Error fetching data from GitHub' });
    }
});

// 2. WakaTime Stats Route
app.get('/api/wakatime/stats', async (req, res) => {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;
        const statsResponse = await axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
            headers: { 'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}` }
        });

        res.json(statsResponse.data);

    } catch (error) {
        console.error('Error fetching WakaTime data:', error.message);
        res.status(500).json({ message: 'Error fetching data from WakaTime' });
    }
});

// 3. GitHub Contributions Route 
app.get('/api/github/:username/contributions', async (req, res) => {
    try {
        const { username } = req.params;
        
        const url = `https://github-contributions-api.jogruber.de/v4/${username}`;
        const response = await axios.get(url);
        
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching contribution data:', error.message);
        res.status(500).json({ message: 'Error fetching contribution data' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

