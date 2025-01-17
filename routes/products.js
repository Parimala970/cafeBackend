const express = require('express')

const connection = require('../connection');
const router = express.Router();




///impoting service roles
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');



// name VARCHAR(255) NOT NULL,
// categoryId INT NOT NULL,
// description VARCHAR(255),
// price INT NOT NULL,
// status VARCHAR(20)

router.post('/post', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const productData = req.body;

    const query = "INSERT INTO product (name, categoryId, description, price, status) VALUES (?, ?, ?, ?, 'false')";

    connection.query(query, [productData.name, productData.categoryId, productData.description, productData.price, productData.status], (err, results) => {
        if (err) {
            console.error('Error inserting product:', err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error", error: err });
        }

        console.log('Product inserted:', results); // Log the results for reference
        return res.status(201).json({ message: "Product created successfully", productId: results.insertId });
    });
});

// update

router.get('/get', auth.authenticationToken, (req, res) => {
    const query = "SELECT * FROM product ";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err)
        }
    })
});

//joining  two tables with categoryId 
router.get('/getdata', auth.authenticationToken, (req, res) => {
    const query = `
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.status,
    c.id AS categoryId,
    c.name AS category_name
FROM 
    product AS p
INNER JOIN 
    category AS c ON p.categoryId = c.id;
`;

    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json({
                message: "Data retrieved successfully",
                data: results
            });
        } else {
            return res.status(500).json({
                message: "An error occurred while retrieving data",
                error: err
            });
        }
    });


});


/// getting only category based data
// router.get('/getcategory/:id', (req, res, next) => {
//     const id = req.params.id;
//     var query = 'SELECT id, name FROM product WHERE categoryId = ? AND status = "true"';
//     connection.query(query, [id], (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 message: "An error occurred while retrieving data",
//                 error: err
//             });
//         }
//         console.log("Query results:", results); // Log results

//         if (results.length === 0) {
//             return res.status(404).json({
//                 message: `No data found for category ID: ${id}`
//             });
//         }

//         return res.status(200).json({
//             message: "Data retrieved successfully",
//             data: results
//         });
//         // return res.status(200).json(results[0])
//     });
// });

router.get('/getcategory/:categoryId', (req, res, next) => {
    const id = req.params.categoryId;
    var query = 'SELECT id, name, status FROM product WHERE categoryId = ? AND status = "true"';

    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "An error occurred while retrieving data",
                error: err
            });
        }

        console.log("Query results:", results); // Log results

        // Condition 1: No products found for the category
        if (results.length === 0) {
            return res.status(404).json({
                message: `No data found for category ID: ${id}`
            });
        }

        // Condition 2: Check if any products are unavailable
        const unavailableProducts = results.filter(product => product.status === false);

        if (unavailableProducts.length > 0) {
            return res.status(200).json({
                message: "Some products are currently not available."
                // No product data returned here
            });
        }

        // Condition 3: All products are available
        return res.status(200).json({
            message: "Data retrieved successfully",
            data: results // Return data only if all products are available
        });
    });
});






// getting all dsts below api

router.get('/getById/:id', (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM product WHERE id = ?";

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error", error: err });
        }
        console.log("Query results:", results); // Log results

        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(results[0]); // Return the product data
    });
});

//update
// name VARCHAR(255) NOT NULL,
// categoryId INT NOT NULL,
// description VARCHAR(255),
// price INT NOT NULL,
// status VARCHAR(20)

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const productData = req.body;
    //const id = req.params.id;

    let query = 'UPDATE product SET name = ?, categoryId = ?, description = ?, price = ? WHERE id = ?';
    connection.query(query, [productData.name, productData.categoryId, productData.description, productData.price, productData.id], (err, results) => {
        if (err) {
            console.error('Error updating product:', err); // Log the error for debugging
            return res.status(500).json({ message: 'Internal Server Error', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully' });
    });
});



router.delete('/delete/:id', auth.authenticationToken, (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM product WHERE id = ?";

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error", error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    });
});

///
router.patch('/updateproductstatus', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    // const productId = req.params.id;
    const productData = req.body;
    // Expecting { status: true/false } in the request body

    // Validate status
    // if (typeof status !== 'boolean') {
    //     return res.status(400).json({
    //         message: "Invalid status value. Please provide a boolean value."
    //     });
    // }

    var query = 'UPDATE product SET status = ? WHERE id = ?';

    connection.query(query, [productData.status, productData.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "An error occurred while updating the status",
                error: err
            });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: `No product found with ID: ${productData.id}`
            });
        }

        return res.status(200).json({
            message: "Product status updated successfully",
            data: {
                id: productData.id,
                status: productData.status
            }
        });
    });
});

module.exports = router



