// require('dotenv').config();
// const jwt = require('jsonwebtoken');

// function authenticationToken(req, res, next) {
//     const authHeader = req.headers['authorisation']
//     const token = authHeader && authHeader.split[''][1]

//     if (token == null) {
//         return res.sendStatus(401)
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
//         if (err) {
//             return res.sendStatus(403);
//         }
//         res.locals = response;
//         next();
//     })
// }
// module.exports = { authenticationToken }

require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];  // Correct header key is 'authorization'
    const token = authHeader && authHeader.split(' ')[1];  // Split by space to get token

    if (token == null) {
     return res.status(401).json({ message: 'No token provided' });  // Better error response
       //return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });  // Informative error response
        }
        res.locals= response;  // Store decoded token payload (user data) in `res.locals`
        next();  // Call next middleware or route handler
    });
}

module.exports = { authenticationToken };
