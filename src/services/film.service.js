const filmsDao = require('../daos/film.dao');
const { callDao, callDaoArray } = require('../utils/serviceHelper');

const filmsService = {
    getAll: (callback) => {
        callDaoArray(filmsDao.getAll, [], callback);
    },

    getById: (filmId, callback) => {
        callDao(filmsDao.getById, [filmId], callback);
    },

    getByIdWithDetails: (filmId, callback) => {
        callDao(filmsDao.getByIdWithDetails, [filmId], callback);
    },

    getWithSearch: (searchQuery, limit, offset, callback) => {
        callDao(filmsDao.getWithSearch, [searchQuery, limit, offset], callback);
    },

    createRental: (filmId, customerId, staffId, callback) => {
        callDao(filmsDao.createRental, [filmId, customerId, staffId], callback);
    },

    getAllCustomers: (callback) => {
        callDaoArray(filmsDao.getAllCustomers, [], callback);
    }
};

module.exports = filmsService;