const connection = require('../db/connection');
const queries = require('../db/query');

const customersDao = {
  get: (customerId, callback) => {
    if (customerId === undefined) {
      connection.query(queries.customer.getAll, (err, results) => {
        if (err) return callback(err, undefined);
        return callback(undefined, results);
      });
    } else {
      connection.query(queries.customer.getById, [customerId], (err, results) => {
        if (err) return callback(err, undefined);
        return callback(undefined, results);
      });
    }
  },

  create: (firstName, lastName, callback) => {
    connection.query(
      queries.customer.create,
      [firstName, lastName],
      (err, result) => {
        if (err) return callback(err, undefined);
        return callback(undefined, result);
      }
    );
  },

  update: (customerId, firstName, lastName, callback) => {
    connection.query(
      queries.customer.update,
      [firstName, lastName, customerId],
      (err, result) => {
        if (err) return callback(err, undefined);
        return callback(undefined, result);
      }
    );
  },

  delete: (customerId, callback) => {
    connection.query(queries.customer.delete, [customerId], (err, result) => {
      if (err) return callback(err, undefined);
      return callback(undefined, result);
    });
  },
};

module.exports = customersDao;
