const data = require('../db/sql/exampleData');
const connection = require('../db/sql/connection');

const usersDao ={
    get:(userId, callback)=>{
        connection.query(
        userId == undefined
        ? (`SELECT * FROM ??`)
        : (`SELECT * FROM ?? WHERE ?? = ?`), ['customer', 'customer_id', userId],
        (err, results) => {
            if (err) return callback(err, undefined);
            if (results) return callback(undefined, results);
        });
    },
    delete: () => {
        // connection.query('DELETE FROM customer WHERE customer_id = ?', [id], (err, result) => {
    }
}

module.exports = usersDao;