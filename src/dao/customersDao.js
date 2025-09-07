const data = require('../db/sql/exampleData');
const connection = require('../db/sql/connection');

const customersDao = {
    get: (customerId, callback) => {
        connection.query(
            customerId == undefined
                ? (`SELECT * FROM ??`)
                : (`SELECT * FROM ?? WHERE ?? = ?`),
            ['customer', 'customer_id', customerId],
            (err, results) => {
                if (err) return callback(err, undefined);
                if (results) return callback(undefined, results);
            }
        );
    },
    delete: () => {
        // connection.query('DELETE FROM customer WHERE customer_id = ?', [id], (err, result) => {
    }
};

module.exports = customersDao;