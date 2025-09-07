const customersDao = require('../dao/customersDao');

const customersService = {
    get: (customerId, callback) => {
        customersDao.get(customerId, (err, customers) => {
            if (err) return callback(err, undefined);
            return callback(undefined, customers || []);
        });
    },

    create: (firstName, lastName, callback) => {
        customersDao.create(firstName, lastName, (err, result) => {
            if (err) return callback(err, undefined);
            return callback(undefined, result);
        });
    },

    update: (customerId, firstName, lastName, callback) => {
        customersDao.update(customerId, firstName, lastName, (err, result) => {
            if (err) return callback(err, undefined);
            return callback(undefined, result);
        });
    },

    delete: (customerId, callback) => {
        customersDao.delete(customerId, (err, result) => {
            if (err) return callback(err, undefined);
            return callback(undefined, result);
        });
    }
};

module.exports = customersService;
