const customersDao = require('../dao/customersDao');
const logger = require('../utils/logger');
const customersService = {
    get: (customerId, callback) => {
        customersDao.get(customerId, (err, customers) => {
            if (err) return callback(err, undefined);

            if (customers) {
                // logger.debug(customers)
                return callback(undefined, customers);
            } else {
                return callback(undefined, []);
            }
        });
    },
    delete: (customerId, callback) => {
        customersDao.delete(customerId, (err, customers) => {
            if (err) return callback(err, undefined);
            if (customers) {
                if (customerId === undefined) return callback(undefined, customers);

                let customer = customers.filter(customer => customer.id == customerId)[0];
                if (!customer) return callback(undefined, []);
                return callback(undefined, [customer]);
            }
        });
    },
}

module.exports = customersService;
