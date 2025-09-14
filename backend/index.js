const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Use the default, more permissive CORS settings.
app.use(cors());

// --- START OF DEBUG ROUTES ---

// 1. Root Route (Health Check)
// This helps us confirm if the server is running at all.
app.get('/', (req, res) => {
  res.send('Backend server is alive and running!');
});

// 2. Environment Variable Test Route
// This helps us confirm if the secret keys are loaded correctly.
app.get('/test-env', (req, res) => {
  res.json({
    githubTokenExists: !!process.env.GITHUB_TOKEN,
    wakatimeKeyExists: !!process.env.WAKATIME_API_KEY,
  });
});

// --- END OF DEBUG ROUTES ---


// --- API ROUTES ---

// 1. GitHub Profile and Repositories Route
app.get('/api/github/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const token = process.env.GITHUB_TOKEN;
        
        if (!token) {
          throw new Error("CRITICAL: GitHub token is not configured on the server.");
        }

        const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=10&sort=pushed`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        res.json({ user: userResponse.data, repos: reposResponse.data });

    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ message: 'Error fetching data from GitHub' });
    }
});

// 2. WakaTime Stats Route
app.get('/api/wakatime/stats', async (req, res) => {
    try {
        const apiKey = process.env.WAKATIME_API_KEY;
        
        if (!apiKey) {
          throw new Error("CRITICAL: WakaTime API key is not configured on the server.");
        }

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

