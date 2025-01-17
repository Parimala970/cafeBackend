CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,  -- Unique constraint on email
    password VARCHAR(250) NOT NULL,
    status VARCHAR(20),
    role VARCHAR(20)
);


INSERT INTO users (name, contact_number, email, password, status, role)
VALUES ('admin', '12345', 'admin@gmail.com', 'admin', 'true', 'admin');


--category

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoryId INT NOT NULL,
    description VARCHAR(255),
    price INT NOT NULL,
    status VARCHAR(20)
);

-- const query = `
-- SELECT 
--     p.id AS product_id,
--     p.name AS product_name,
--     p.description,
--     p.price,
--     p.status,
--     c.id AS categoryId,
--     c.name AS category_name
-- FROM 
--     product AS p
-- INNER JOIN 
--     category AS c ON p.categoryId = c.id;
-- `;


CREATE TABLE bill (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Primary key
    uuid VARCHAR(36) NOT NULL,          -- UUID to uniquely identify each bill
    name VARCHAR(255) NOT NULL,         -- Customer's name
    email VARCHAR(255) NOT NULL,        -- Customer's email
    contactnumber VARCHAR(15) NOT NULL, -- Customer's contact number
    paymentmethod VARCHAR(50) NOT NULL, -- Payment method
    total INT NOT NULL,                 -- Total bill amount (now as integer)
    productdetails JSON NOT NULL,       -- Product details stored as JSON
    created_by VARCHAR(255) NOT NULL,   -- Creator (e.g., admin or user who created the bill)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Auto set the bill creation timestamp
);
---for above table below inserting data
INSERT INTO bill (uuid, name, email, contactnumber, paymentmethod, total, productdetails, created_by)
VALUES 
(
    UUID(), 
    'John Smith', 
    'johnsmith@example.com', 
    '9876543210', 
    'card', 
    1500,  -- Total bill amount as an integer
    '{"products": [{"name": "T-Shirt", "price": 500}, {"name": "Jeans", "price": 1000}]}', -- Product details as JSON
    'Admin'
),
(
    UUID(), 
    'Alice Johnson', 
    'alice.johnson@example.com', 
    '1234567890', 
    'cash', 
    2000,  -- Another total bill amount as integer
    '{"products": [{"name": "Shoes", "price": 1500}, {"name": "Cap", "price": 500}]}',
    'Admin'
);

