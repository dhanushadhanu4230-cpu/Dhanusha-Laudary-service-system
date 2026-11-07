const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname, 'public')));


// =====================================
// MYSQL DATABASE CONNECTION
// =====================================

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dhanusha_laundry_db'
});

db.connect((err) => {
    if (err) {
        console.log('Database Connection Failed:', err.message);
    } else {
        console.log('MySQL Database Connected Successfully!');
    }
});


// =====================================
// HOME PAGE
// =====================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// =====================================
// CUSTOMERS CRUD
// =====================================

// CREATE CUSTOMER
app.post('/api/customers', (req, res) => {

    const { name, phone, email, address } = req.body;

    const sql = `
        INSERT INTO customers
        (name, phone, email, address)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, phone, email, address], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({
            message: 'Customer Added Successfully',
            customer_id: result.insertId
        });

    });
});


// READ CUSTOMERS
app.get('/api/customers', (req, res) => {

    db.query('SELECT * FROM customers', (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(result);

    });
});


// UPDATE CUSTOMER
app.put('/api/customers/:id', (req, res) => {

    const { name, phone, email, address } = req.body;

    const sql = `
        UPDATE customers
        SET name=?, phone=?, email=?, address=?
        WHERE customer_id=?
    `;

    db.query(sql, [
        name,
        phone,
        email,
        address,
        req.params.id
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({ message: 'Customer Updated Successfully' });

    });
});


// DELETE CUSTOMER
app.delete('/api/customers/:id', (req, res) => {

    db.query(
        'DELETE FROM customers WHERE customer_id=?',
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Customer Deleted Successfully' });

        }
    );
});


// =====================================
// SERVICES CRUD
// =====================================

// CREATE SERVICE
app.post('/api/services', (req, res) => {

    const { service_name, price_per_kg, description } = req.body;

    const sql = `
        INSERT INTO services
        (service_name, price_per_kg, description)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [
        service_name,
        price_per_kg,
        description
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({
            message: 'Service Added Successfully',
            service_id: result.insertId
        });

    });
});


// READ SERVICES
app.get('/api/services', (req, res) => {

    db.query('SELECT * FROM services', (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(result);

    });
});


// UPDATE SERVICE
app.put('/api/services/:id', (req, res) => {

    const { service_name, price_per_kg, description } = req.body;

    const sql = `
        UPDATE services
        SET service_name=?, price_per_kg=?, description=?
        WHERE service_id=?
    `;

    db.query(sql, [
        service_name,
        price_per_kg,
        description,
        req.params.id
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({ message: 'Service Updated Successfully' });

    });
});


// DELETE SERVICE
app.delete('/api/services/:id', (req, res) => {

    db.query(
        'DELETE FROM services WHERE service_id=?',
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Service Deleted Successfully' });

        }
    );
});


// =====================================
// ORDERS CRUD
// =====================================

// CREATE ORDER
app.post('/api/orders', (req, res) => {

    const {
        customer_id,
        service_id,
        order_date,
        delivery_date,
        total_amount,
        status
    } = req.body;

    const sql = `
        INSERT INTO orders
        (customer_id, service_id, order_date, delivery_date, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        customer_id,
        service_id,
        order_date,
        delivery_date,
        total_amount,
        status
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({
            message: 'Order Added Successfully',
            order_id: result.insertId
        });

    });
});


// READ ORDERS
app.get('/api/orders', (req, res) => {

    const sql = `
        SELECT
            o.*,
            c.name AS customer_name,
            s.service_name
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.customer_id
        JOIN services s
            ON o.service_id = s.service_id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(result);

    });
});


// UPDATE ORDER
app.put('/api/orders/:id', (req, res) => {

    const {
        customer_id,
        service_id,
        order_date,
        delivery_date,
        total_amount,
        status
    } = req.body;

    const sql = `
        UPDATE orders
        SET customer_id=?,
            service_id=?,
            order_date=?,
            delivery_date=?,
            total_amount=?,
            status=?
        WHERE order_id=?
    `;

    db.query(sql, [
        customer_id,
        service_id,
        order_date,
        delivery_date,
        total_amount,
        status,
        req.params.id
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({ message: 'Order Updated Successfully' });

    });
});


// DELETE ORDER
app.delete('/api/orders/:id', (req, res) => {

    db.query(
        'DELETE FROM orders WHERE order_id=?',
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Order Deleted Successfully' });

        }
    );
});


// =====================================
// PAYMENTS CRUD
// =====================================

// CREATE PAYMENT
app.post('/api/payments', (req, res) => {

    const {
        order_id,
        amount,
        payment_date,
        payment_method,
        status
    } = req.body;

    const sql = `
        INSERT INTO payments
        (order_id, amount, payment_date, payment_method, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        order_id,
        amount,
        payment_date,
        payment_method,
        status
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({
            message: 'Payment Added Successfully',
            payment_id: result.insertId
        });

    });
});


// READ PAYMENTS
app.get('/api/payments', (req, res) => {

    const sql = `
        SELECT p.*
        FROM payments p
        JOIN orders o
            ON p.order_id = o.order_id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json(result);

    });
});


// UPDATE PAYMENT
app.put('/api/payments/:id', (req, res) => {

    const {
        order_id,
        amount,
        payment_date,
        payment_method,
        status
    } = req.body;

    const sql = `
        UPDATE payments
        SET order_id=?,
            amount=?,
            payment_date=?,
            payment_method=?,
            status=?
        WHERE payment_id=?
    `;

    db.query(sql, [
        order_id,
        amount,
        payment_date,
        payment_method,
        status,
        req.params.id
    ], (err, result) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({ message: 'Payment Updated Successfully' });

    });
});


// DELETE PAYMENT
app.delete('/api/payments/:id', (req, res) => {

    db.query(
        'DELETE FROM payments WHERE payment_id=?',
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ message: 'Payment Deleted Successfully' });

        }
    );
});


// =====================================
// SERVER
// =====================================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});