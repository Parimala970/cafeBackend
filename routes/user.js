const express = require('express');
const connection = require('../connection');
//jwt token

const jwt = require('jsonwebtoken');
require('dotenv').config();

///impoting service roles
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole')
const nodemailer = require('nodemailer')

const router = express.Router();

// router.post('/signup', (req, res) => {
//     let user = req.body;

//     // Corrected the SQL syntax by removing the extra comma
//     let query = 'SELECT email, password, role, status FROM users WHERE email = ?';

//     connection.query(query, [user.email], (err, results) => {
//         if (!err) {
//             if (results.length <= 0) {
//                 // Corrected the SQL query string
//                 query = 'INSERT INTO users (name, contact_number, email, password, status, role) VALUES (?, ?, ?, ?, "false", "user")';

//                 connection.query(query, [user.name, user.contact_number, user.email, user.password], (err, results) => {
//                     if (!err) {
//                         return res.status(200).json({ message: "Successfully registered" });
//                     } else {
//                         return res.status(500).json(err);
//                     }
//                 });
//             } else {
//                 return res.status(400).json({
//                     message: "Email already exists"
//                 });
//             }
//         } else {
//             return res.status(500).json(err);
//         }
//     });
// });

// backend API: /signup
// Assuming you have an Express POST endpoint for signup

// Example of signup route
router.post('/signup', async (req, res) => {
    const { name, contact_number, email, password, status, role } = req.body;

    // Check if email already exists
    let queryCheck = `SELECT * FROM users WHERE email = ?`;
    connection.query(queryCheck, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database query error", error: err });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // If email does not exist, proceed with the insert
        const insertQuery = `INSERT INTO users (name, contact_number, email, password, status, role) VALUES (?, ?, ?, ?, ?, ?)`;
        connection.query(insertQuery, [name, contact_number, email, password, status, role], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Internal Server Error", error: err });
            }
            res.status(201).json({ message: "Successfully registered" });
        });
    });
});









///login


// router.post('/login', (req, res) => {
//     const user = req.body;
//     query = 'select email,password,role,status, from user where email = ?';
//     connection.query(query, [user.email, user.password], (err, results) => {
//         if (!err) {
//             if (results[0].length <= 0 || results[0].password) {
//                 return res.status(401).json({
//                     message: "Incorrect useremail or usePassword"
//                 });
//             } else if (results[0].status === 'false') {
//                 return res.status(401).json({
//                     message: "Wait for Admin Approval"

//                 });
//             } else if (results[0].password == user.password) {
//                 const response = {
//                     email: results[0].email, role: results[0].role
//                 }
//                 const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
//                 res.status(200).json({ token: accessToken })
//             }
//             else {
//                 return res.status(500).json(err);
//             }
//         } else {
//             return res.status(400).json({
//                 message: " Something went wrong..!!! .Please Try again Later"
//             });
//         }
//     })
// })


// router.post('/login', (req, res) => {
//     const user = req.body;

//     // Fixed query: removed trailing comma and changed 'user' to 'users'
//     const query = 'SELECT email, password, role, status FROM users WHERE email = ?';

//     connection.query(query, [user.email], (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 message: "Something went wrong. Please try again later."
//             });
//         }

//         // Check if user exists
//         if (results.length <= 0) {
//             return res.status(401).json({
//                 message: "Incorrect email or password."
//             });
//         }

//         const dbUser = results[0];

//         // Check if user status is 'false'
//         if (dbUser.status === 'false') {
//             return res.status(401).json({
//                 message: "Wait for Admin Approval."
//             });
//         }

//         // Validate password
//         if (dbUser.password !== user.password) {
//             return res.status(401).json({
//                 message: "Incorrect email or password."
//             });
//         }

//         // Generate token if everything is valid
//         const response = {
//             email: dbUser.email,
//             role: dbUser.role
//         };
//         const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
//         res.status(200).json({ token: accessToken });
//     });
// });

router.post('/login', (req, res) => {
    const user = req.body;

    let query = 'SELECT email, password, role, status FROM users WHERE email = ?';

    connection.query(query, [user.email], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Something went wrong. Please try again later."
            });
        }

        // Check if user exists
        if (results.length <= 0) {
            return res.status(401).json({
                message: "Incorrect email or password."
            });
        }

        const dbUser = results[0];



        // Compare the stored password with the entered password
        if (dbUser.password !== user.password) {
            return res.status(401).json({
                message: "Incorrect email or password."
            });
        }

        // Check if user status is 'false'
        if (dbUser.status === 'false') {
            return res.status(401).json({
                message: "Wait for Admin Approval."
            });
        }

        // Generate token if everything is valid
        const response = {
            email: dbUser.email,
            role: dbUser.role
        };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
        res.status(200).json({ token: accessToken });
    });
});

//USING NODEMAILER

// var transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// })


// Create Nodemailer transport
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/forgotpassword', (req, res) => {
    const user = req.body;
  let query = 'SELECT  email , password  FROM users WHERE email = ?';
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({
                    message: "password sent successfully to your email . please check..!"
                })
            } else {
                var emailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password by Management System",
                    html: '<p> <b> Your Login details for cafe management sydtems </b><br> <b>Email:</b>' + results[0].email + '<br> <b>password</b>' + results[0].password + '<br> <a href="http://:4200/"> Click here to Login</a></p> '
                };

                transport.sendMail(emailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('eMAIL SENT TO' + info.response)
                    }
                });

                return res.status(200).json({
                    message: 'Password sent successfully to your email'
                })

            }
        }
    })
})



// var transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: "parimala.k3952@gmail.com",
//         pass: "Pari##418"
//     }
// })


//Forgot Password Route

//get  only user roles
router.get('/get', auth.authenticationToken, (req, res) => {
    var query = "SELECT id, name , email, contact_number, status FROM users WHERE role ='user' ";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err)
        }
    })
})
//forgot password
router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    let query = 'SELECT email, password FROM users WHERE email = ?';

    connection.query(query, [user.email], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching user data."
            });
        }

        if (results.length <= 0) {
            return res.status(404).json({
                message: "Email not found!"
            });
        } else {
            // Define the transport here
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,  // Your email from environment variables
                    pass: process.env.PASSWORD // Your password from environment variables
                }
            });

            var emailOptions = {
                from: process.env.EMAIL,
                to: "parimala.k3952@gmail.com",
                subject: "Password by Management System",
                html: `<p> <b>Your Login details for cafe management system:</b><br> 
                        <b>Email:</b> ${results[0].email}<br> 
                        <b>Password:</b> ${results[0].password}<br>
                        <a href="http://localhost:4200/">Click here to Login</a></p>`
            };

            transport.sendMail(emailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error sending email."
                    });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).json({
                        message: 'Password sent successfully to your email. Please check!'
                    });
                }
            });
        }
    });
});






router.get('/getdata', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let query = "SELECT id, name, email, contact_number, status FROM users WHERE role ='user'";

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Log the error for debugging
            return res.status(500).json({ message: 'Internal Server Error', error: err });
        }

        return res.status(200).json(results); // Send user data to admin
    });
});

//updtae query 

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    let query = 'update users set status=? where id = ?';
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    message: "user does not exist"
                });
            }
            return res.status(200).json({
                message: "User updated successfully"
            });
        } else {
            return res.status(500).json(err)
        }
    })
})

// checking token

router.get('/checkToken',  auth.authenticationToken,  (req, res) => {
    return res.status(200).json({ message: 'true' })
})

// api for changumf pasword

router.post('/changePassword', auth.authenticationToken,  (req, res) => {
    const user = req.body;
    const email = res.locals.email
    var query = 'select * from users where email =? and password = ?';
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "incorrect Old Password" })
            } else if (results[0].password == user.oldPassword) {
                query = 'update users  set password =? where email = ?'
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "password updated successffully" })
                    } else {
                        return res.status(500).json(err)
                    }
                })

            } else {
                return res.status(400).json({ message: "Something went wrong please try again later" })
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

// router.post('/changepassword', auth.authenticationToken, (req, res) => {
//     const user = req.body;
//     const email = res.locals.email;

//     const query = 'SELECT * FROM users WHERE email = ?';
//     connection.query(query, [email], (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: "Internal Server Error", error: err });
//         }

//         if (results.length <= 0) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         const userRecord = results[0];

//         // Here, directly compare the passwords (ensure they're hashed in your database)
//         if (userRecord.password !== user.oldPassword) {
//             return res.status(400).json({ message: "Incorrect old password" });
//         }

//         // Update the password
//         const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
//         connection.query(updateQuery, [user.newPassword, email], (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: "Internal Server Error", error: err });
//             }
//             return res.status(200).json({ message: "Password updated successfully" });
//         });
//     });
// });




module.exports = router;
