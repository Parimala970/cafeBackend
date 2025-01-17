const express = require('express')

const connection = require('../connection');
const router = express.Router();

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/details', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    var categoryCount;
    var productCount;
    var billCount;

    var query = 'select count(id) as categoryCount from category';
    connection.query(query, (err, results) => {
        if (!err) {
            categoryCount = results[0].categoryCount;
        } else {
            return res.status(500).json({ message: "Database error", error: err });

        }
    })

    var query = 'select count(id) as productCount from product ';
    connection.query(query, (err, results) => {
        if (!err) {
            productCount = results[0].productCount;
        } else {
            return res.status(500).json({ message: "Database error", error: err });

        }
    })

    var query = 'select count(id) as billCount from bill ';
    connection.query(query, (err, results) => {
        if (!err) {
            billCount = results[0].billCount;
            var data = {
                category: categoryCount,
                product: productCount,
                bill: billCount
            }
            return res.status(200).json(data)
        } else {
            return res.status(500).json({ message: "Database error", error: err });

        }
    })
})

module.exports = router


// const express = require('express');
// const connection = require('../connection');
// const router = express.Router();

// var auth = require('../services/authentication');
// var checkRole = require('../services/checkRole');

// router.get('/details', auth.authenticationToken, checkRole.checkRole, async (req, res) => {
//     try {
//         const categoryQuery = 'SELECT COUNT(id) AS categoryCount FROM category';
//         const productQuery = 'SELECT COUNT(id) AS productCount FROM product';
//         const billQuery = 'SELECT COUNT(id) AS billCount FROM bill';

//         const [categoryResults] = await connection.query(categoryQuery);
//         const [productResults] = await connection.query(productQuery);
//         const [billResults] = await connection.query(billQuery);

//         const data = {
//             category: categoryResults[0].categoryCount,
//             product: productResults[0].productCount,
//             bill: billResults[0].billCount
//         };

//         return res.status(200).json(data);
//     } catch (err) {
//         return res.status(500).json({ message: "Database error", error: err });
//     }
// });

// module.exports = router;
