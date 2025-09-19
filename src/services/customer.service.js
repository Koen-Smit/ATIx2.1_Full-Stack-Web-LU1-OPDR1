const customersDao = require('../daos/customer.dao');
const { callDao, callDaoArray } = require('../utils/serviceHelper');

const customersService = {
    get: (customerId, callback) => {
        callDaoArray(customersDao.get, [customerId], callback);
    },

    getById: (customerId, callback) => {
        callDao(customersDao.getById, [customerId], callback);
    },

    getByIdWithDetails: (customerId, callback) => {
        callDao(customersDao.getByIdWithDetails, [customerId], callback);
    },

    getRentals: (customerId, sortBy, sortOrder, callback) => {
        callDao(customersDao.getRentals, [customerId, sortBy, sortOrder], callback);
    },

    getWithSearch: (searchQuery, limit, offset, callback) => {
        callDao(customersDao.getWithSearch, [searchQuery, limit, offset], callback);
    },

    create: (firstName, lastName, callback) => {
        callDao(customersDao.create, [firstName, lastName], callback);
    },

    createWithFullDetails: (firstName, lastName, email, storeId, active, createDate, callback) => {
        callDao(customersDao.createWithFullDetails, [firstName, lastName, email, storeId, active, createDate], callback);
    },

    update: (customerId, firstName, lastName, callback) => {
        callDao(customersDao.update, [customerId, firstName, lastName], callback);
    },

    updateProfile: (customerId, updateData, callback) => {
        callDao(customersDao.updateProfile, [customerId, updateData], callback);
    },

    delete: (customerId, callback) => {
        callDao(customersDao.delete, [customerId], callback);
    },

    cascadeDelete: (customerId, callback) => {
        callDao(customersDao.cascadeDelete, [customerId], callback);
    }
};

module.exports = customersService;
