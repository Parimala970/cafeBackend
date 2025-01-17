require('dotenv').config();
const jwt = require('jsonwebtoken');

function checkRole(req, res, next) {
    const role = res.locals.role; // Make sure the role is correctly set in res.locals

    if (role === process.env.USER)
        return res.sendStatus(401); // Unauthorized for normal users
    else
        next(); // Allow access for other roles

}

// function checkRole(req, res, next) {
//     const role = res.locals.role; // Get the role from res.locals

//     if (role !== 'admin') { // Only allow access if role is admin
//         return res.sendStatus(403); // Forbidden for non-admin users
//     }
//     next(); // Proceed if the user is admin
// }


module.exports = { checkRole: checkRole };
