const ejs = require('ejs'); // Optional, Express handles EJS
const express = require('express')
const path = require('path');
const uuid = require('uuid');
const pdf = require('html-pdf'); // If you need to generate PDFs
const router = express.Router();
const app = express();
const fs = require('fs')
var auth = require("../services/authentication");
const connection = require('../connection');
const json = require('body-parser/lib/types/json');


/// api for 
// router.post('/generateReport', (req, res) => {
//     const generateUUId = uuid.v1();
//     const orderDetails = req.body;

//     var prodDetailsReport = json.parse(orderDetails.productDetails);

//     var query = "insert into bill (bill, uuid, email,contactNumber, paymentmethod, total,productdetails, createdBy values (? ,?,?,?,?,?,?,?,?) ";

// })


// router.post('/generateReport', auth.authenticationToken, (req, res) => {
//     const generateUUId = uuid.v4(); // Use v4 for UUID generation
//     const orderDetails = req.body;

//     // var prodDetailsReport = JSON.parse(orderDetails.productDetails);
//     var prodDetailsReport = JSON.parse(orderDetails.productDetails);


//     const query = "INSERT INTO bill (uuid, name, email, contactNumber, paymentmethod, total, productdetails, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

//     const values = [
//         generateUUId,
//         orderDetails.name,
//         orderDetails.email, // Use email from orderDetails
//         orderDetails.contactnumber,
//         orderDetails.paymentmethod,
//         orderDetails.total,
//         JSON.stringify(prodDetailsReport), // Store product details as JSON
//         res.locals.email // Use res.locals.email for created_by
//     ];


//     connection.query(query, values, (err, results) => {

//         if (!err) {
//             ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
//                 prodDetails: prodDetailsReport,
//                 name: orderDetails.name,
//                 email: orderDetails.email,
//                 contact_number: orderDetails.contactnumber,
//                 paymentmethod: orderDetails.paymentmethod,
//                 totalamount: orderDetails.total
//             }, (err, results) => {
//                 if (err) {
//                     return res.status(500).json(err)
//                 } else {
//                     pdf.create(data).toFile('../generated_pdf/' + generateUUId + '.pdf', (err, data) => {
//                         if (err) {
//                             console.log(err);
//                             return res.status(500).json(err)
//                         } else {
//                             return res.status(200).json({ uuid: generateUUId })
//                         }
//                     })
//                 }

//             })
//         } else {
//             return res.status(500).json(err)
//         }
//     })



// });


// router.post('/generateReport', auth.authenticationToken, (req, res) => {
//     const generateUUId = uuid.v4(); // Use v4 for UUID generation
//     const orderDetails = req.body;

//     // Parse product details from JSON
//     let prodDetailsReport;
//     try {
//         prodDetailsReport = JSON.parse(orderDetails.productDetails);
//     } catch (error) {
//         return res.status(400).json({
//             message: "Invalid product details format",
//             error: error.message
//         });
//     }

//     // Calculate total from product details
//     const total = prodDetailsReport.reduce((acc, product) => {
//         return acc + (product.price * product.quantity);
//     }, 0);

//     const query = "INSERT INTO bill (uuid, name, email, contactNumber, paymentmethod, total, productdetails, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

//     const values = [
//         generateUUId,
//         orderDetails.name,
//         orderDetails.email,
//         orderDetails.contactnumber,
//         orderDetails.paymentmethod,
//         total, // Use the calculated total
//         JSON.stringify(prodDetailsReport), // Store product details as JSON
//         res.locals.email // Use res.locals.email for created_by
//     ];

//     connection.query(query, values, (err, results) => {
//         if (err) {
//             return res.status(500).json(err);
//         }

//         // Render the EJS template for the report
//         ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
//             prodDetails: prodDetailsReport,
//             name: orderDetails.name,
//             email: orderDetails.email,
//             contact_number: orderDetails.contactnumber,
//             paymentmethod: orderDetails.paymentmethod,
//             totalamount: total // Use the calculated total
//         }, (err, html) => {
//             if (err) {
//                 return res.status(500).json(err);
//             } else {
//                 // Create the PDF using the rendered HTML
//                 pdf.create(html).toFile(`../generated_pdf/${generateUUId}.pdf`, (err, data) => {
//                     if (err) {
//                         console.log(err);
//                         return res.status(500).json(err);
//                     } else {
//                         return res.status(200).json({ uuid: generateUUId });
//                     }
//                 });
//             }
//         });
//     });
// });

router.post('/generateReport', auth.authenticationToken, (req, res) => {
    const generateUUId = uuid.v4(); // Use v4 for UUID generation
    const orderDetails = req.body;

    // Parse product details from JSON
    let prodDetailsReport;
    try {
        prodDetailsReport = JSON.parse(orderDetails.productDetails);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid product details format",
            error: error.message
        });
    }

    const query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentmethod, total, productdetails, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        generateUUId, // Use the generated UUID
        orderDetails.name,
        orderDetails.email,
        orderDetails.contactnumber,
        orderDetails.paymentmethod,
        orderDetails.total,
        JSON.stringify(prodDetailsReport), // Store product details as JSON
        res.locals.email // Use res.locals.email for created_by
    ];

    connection.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        ejs.renderFile(path.join(__dirname, "report.ejs"), {
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactnumber, // Match this variable
            paymentMethod: orderDetails.paymentmethod, // Match this variable
            totalAmount: orderDetails.total,
            productDetails: prodDetailsReport,
            createdBy: res.locals.email,
            createdAt: new Date().toLocaleString() // Or format as needed
        }, (err, html) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                // Create the PDF using the rendered HTML
                pdf.create(html).toFile(`./generated_pdf/${generateUUId}.pdf`, (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    } else {
                        return res.status(200).json({ uuid: generateUUId });
                    }
                });
            }
        });



    });
});
//

router.post('/getpdf', auth.authenticationToken, (req, res) => {
    const orderDetails = req.body
    const pdfPath = '../generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType('application/pdf');
        fs.createReadStream(pdfPath).pipe(res)
    }else{
        var prodDetailsReport = JSON.parse(orderDetails.prodDetails)
           // Create the PDF using the rendered HTML
           pdf.create(html).toFile(`./generated_pdf/${generateUUId}.pdf`, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            } else {
               // return res.status(200).json({ uuid: generateUUId });
               res.contentType('application/pdf');
               fs.createReadStream(pdfPath).pipe(res)
            }
        });
    }
})
router.get('/getbill',auth.authenticationToken,(req,res)=>{
    var query='select * from bill order by id DESC';
    connection.query(query, (err, results) => {
        if (!err) {
            res.status(200).json(results)
        } else {
            return res.status(500).json(err); // Corrected this line
        }
    })
});

router.delete('/deletebill/:id', auth.authenticationToken, (req, res) => {
    const billId = req.params.id;  // Get the bill ID from the request params
    var query = 'DELETE FROM bill WHERE id = ?';  // SQL query to delete the bill by ID

    connection.query(query, [billId], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Bill not found" });  // No bill with that ID
            }
            res.status(200).json({ message: "Bill deleted successfully" });  // Bill deleted successfully
        } else {
            return res.status(500).json(err);  // Handle any errors
        }
    });
});




module.exports = router;

