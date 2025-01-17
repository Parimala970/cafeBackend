// const mysql = require('mysql');
// require('dotenv').config();

// var connection = mysql.createConnection({
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// connection.connect((error) => {
//     if (error) {
//         console.log(error)
//     } else {
//         console.log('DB connected successfully ' +process.env.DB_NAME)
//     }
// });

// module.exports = connection

const mysql = require('mysql2'); // Use mysql2 for better compatibility with modern JS
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
connection.connect((error) => {
    if (error) {
        console.error('Database connection failed:', error);
        return; // Exit if the connection fails
    }
    console.log('DB connected successfully to ' + process.env.DB_NAME);
});

// Export the connection for use in other modules
module.exports = connection;
