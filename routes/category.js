const express = require('express')

const connection = require('../connection');
const router = express.Router();
//jwt token



///impoting service roles
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole')

// router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
//     let category = req.body;
//     query = 'insert into category (name) values (?)';
//     connection.query(query, [category.name], (err, results) => {

//         if (!err) {
//             return res.status(200).json({
//                 message: "Category added successfully"
//             })
//         } else {
//             return res.status(500).json(err)
//         }
//     })
// })

router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const category = req.body;

    // Input validation
    if (!category.name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    const query = 'INSERT INTO category (name) VALUES (?)';
    connection.query(query, [category.name], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log error for debugging
            return res.status(500).json({ message: "Internal Server Error" });
        }

        return res.status(201).json({
            message: "Category added successfully",
            categoryId: results.insertId // Optionally return the new category ID
        });
    });
});


router.get('/get', auth.authenticationToken, (req, res, next) => {
    var query = 'select * from category order by name';
    connection.query(query, (err, results) => {
        if (!err) {
            res.status(200).json(results)
        } else {
            return res.status(500).json(err); // Corrected this line
        }
    })
})

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    var product = req.body;

    let query = 'update category set name = ? where id=?';
    connection.query(query, [product.name, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Category does not exist" })
            }
            res.status(200).json({ message: "Category updated sucessfully" })
        } else {
            return res.json(500).json(err)
        }
    })
})

module.exports = router