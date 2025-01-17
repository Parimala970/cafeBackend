// // Load environment variables from .env file
// require('dotenv').config();

// const http = require('http');
// const app = require('./index');

// // Create the server and bind it to the Express app
// const server = http.createServer(app);

// // Set the server to listen on the specified PORT from environment variables
// const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not defined

// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// Load environment variables from .env file
// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = require('./index'); // Import your Express app

// Set the server to listen on the specified PORT from environment variables
const PORT = process.env.PORT || 8080; // Default to 8080 if PORT is not defined

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

