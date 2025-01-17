// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const connection = require('./connection');
// const userRoutes = require('./routes/user');
// const categoryRoutes = require('./routes/category')
// const productRoutes = require('./routes/products');
// const billRoute = require('./routes/bill')
// const app = express();



// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(bodyParser.json()); // This can be redundant; express.json() already handles JSON
// app.use(cors({
//     origin: 'http://localhost:4200', // Change this to your front-end URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
//     credentials: true // Allow credentials (if needed)
//   }));

// app.use('/user', userRoutes);
// app.use('/category', categoryRoutes);
// app.use('/product', productRoutes);
// app.use('/bill', billRoute)
// // Error handling middleware (optional but recommended)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal Server Error' });
// });

// // Exporting the app
// module.exports = app;
const express = require('express');
const cors = require('cors');
const connection = require('./connection'); // Import the database connection
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/products');
const billRoute = require('./routes/bill');
const dashboard = require('./routes/dashboard')

const app = express();

// Middleware
//app.use(cors()); // Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:4200', // Replace with your Angular app's URL
}));

app.use(express.json()); // Use Express's built-in JSON parser

// Routes
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/bill', billRoute);
app.use('/dashboard', dashboard);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Export the app for use in server.js
module.exports = app;
