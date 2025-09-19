const connection = require('../db/connection');
const queries = require('../db/query');

const filmsDao = {
  getAll: (callback) => {
    connection.query(queries.film.getAllWithRentalStatus, (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results);
    });
  },

  getById: (filmId, callback) => {
    connection.query(queries.film.getById, [filmId], (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results[0] || null);
    });
  },

  getByIdWithDetails: (filmId, callback) => {
    connection.query(queries.film.getByIdWithDetails, [filmId], (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results[0] || null);
    });
  },

  getWithSearch: (searchQuery, limit, offset, callback) => {
    const isNumericSearch = !isNaN(searchQuery) && searchQuery.trim() !== '';
    const filmId = isNumericSearch ? parseInt(searchQuery) : null;
    const yearSearch = isNumericSearch ? parseInt(searchQuery) : null;
    
    const countQuery = searchQuery ? queries.film.countWithSearch : queries.film.countAll;
    const countParams = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`, yearSearch, filmId] : [];

    connection.query(countQuery, countParams, (err, countResult) => {
      if (err) return callback(err, undefined);
      
      const total = countResult[0].total;
      
      const dataQuery = searchQuery ? queries.film.getWithSearch : queries.film.getAllPaginated;
      const dataParams = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`, yearSearch, filmId, limit, offset] : [limit, offset];

      connection.query(dataQuery, dataParams, (err, results) => {
        if (err) return callback(err, undefined);
        
        return callback(undefined, {
          films: results,
          total: total
        });
      });
    });
  },

  getInventoryByFilmId: (filmId, callback) => {
    const query = `
      SELECT i.inventory_id 
      FROM inventory i 
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      WHERE i.film_id = ? AND r.rental_id IS NULL
      LIMIT 1`;
    
    connection.query(query, [filmId], (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results[0] || null);
    });
  },

  createRental: (filmId, customerId, staffId, callback) => {
    filmsDao.getInventoryByFilmId(filmId, (err, inventory) => {
      if (err) return callback(err, undefined);
      if (!inventory) {
        return callback(new Error('Geen beschikbare exemplaren van deze film'), undefined);
      }

      connection.query(queries.film.createRental, [inventory.inventory_id, customerId, staffId], (err, result) => {
        if (err) return callback(err, undefined);
        return callback(undefined, result);
      });
    });
  },

  getAllCustomers: (callback) => {
    connection.query('SELECT customer_id, first_name, last_name FROM customer WHERE active = 1 ORDER BY first_name, last_name', (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results);
    });
  }
};

module.exports = filmsDao;