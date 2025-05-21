// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Configure appropriately for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Serve static files
app.use(express.static('public'));

// Transactions endpoint
app.post('/api/transactions', async (req, res) => {
  try {
    const jwtHeader = req.headers.authorization;
    const apiKey = process.env.TIVOLI_API_KEY;

    if (!jwtHeader || !apiKey) {
      return res.status(401).json({ error: "Missing auth info" });
    }

    const token = jwtHeader.replace(/^Bearer\s+/i, "");
    
    try {
      const response = await fetch("https://yrgobanken.vip/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "x-api-key": apiKey
        },
        body: JSON.stringify(req.body)
      });

      const responseText = await response.text();

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        return res.status(502).json({
          error: "Invalid JSON response from Tivoli API",
          raw: responseText
        });
      }

      if (!response.ok) {
        const errorData = data;
        return res.status(response.status).json({
          error: errorData.error || "Transaction failed",
          details: errorData
        });
      }

      return res.json(data);
    } catch {
      return res.status(503).json({ error: "Failed to connect to Tivoli API" });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected transaction error";
    return res.status(500).json({ error: message });
  }
});

const path = require('path');

// For production, serve the React app
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // For any other route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});