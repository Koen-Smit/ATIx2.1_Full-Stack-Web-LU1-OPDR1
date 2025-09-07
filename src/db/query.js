const queries = {
  customer: {
    getAll: `SELECT * FROM customer ORDER BY customer_id DESC`,
    getById: `SELECT * FROM customer WHERE customer_id = ? ORDER BY customer_id DESC`,
    create: `INSERT INTO customer (store_id, first_name, last_name, address_id, create_date) VALUES (1, ?, ?, 1, NOW())`,
    update: `UPDATE customer SET first_name = ?, last_name = ? WHERE customer_id = ?`,
    delete: `DELETE FROM customer WHERE customer_id = ?`,
  },
};

module.exports = queries;
