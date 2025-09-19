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

  getById: (customerId, callback) => {
    connection.query(queries.customer.getById, [customerId], (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results[0] || null);
    });
  },

  getByIdWithDetails: (customerId, callback) => {
    connection.query(queries.customer.getByIdWithDetails, [customerId], (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results[0] || null);
    });
  },

  getRentals: (customerId, sortBy = 'rental_date', sortOrder = 'DESC', callback) => {
    // Validation for SQL injection
    const allowedSortFields = ['rental_date', 'return_date', 'title', 'payment_amount'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'rental_date';
    }
    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      sortOrder = 'DESC';
    }

    const query = `
      SELECT 
        r.*,
        f.title,
        f.description,
        f.release_year,
        f.rating,
        f.replacement_cost,
        i.inventory_id,
        s.first_name as staff_first_name,
        s.last_name as staff_last_name,
        p.amount as payment_amount,
        p.payment_date
      FROM rental r
      LEFT JOIN inventory i ON r.inventory_id = i.inventory_id
      LEFT JOIN film f ON i.film_id = f.film_id
      LEFT JOIN staff s ON r.staff_id = s.staff_id
      LEFT JOIN payment p ON r.rental_id = p.rental_id
      WHERE r.customer_id = ?
      ORDER BY ${sortBy} ${sortOrder}`;

    connection.query(query, [customerId], (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results);
    });
  },

  getWithSearch: (searchQuery, limit, offset, callback) => {
    const isNumericSearch = !isNaN(searchQuery) && searchQuery.trim() !== '';
    const customerId = isNumericSearch ? parseInt(searchQuery) : null;
    
    const countQuery = searchQuery ? queries.customer.countWithSearch : queries.customer.countAll;
    const countParams = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, customerId] : [];

    connection.query(countQuery, countParams, (err, countResult) => {
      if (err) return callback(err, undefined);
      
      const total = countResult[0].total;
      
      const dataQuery = searchQuery ? queries.customer.getWithSearch : queries.customer.getAllPaginated;
      const dataParams = searchQuery ? 
        [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, customerId, limit, offset] : 
        [limit, offset];

      connection.query(dataQuery, dataParams, (err, results) => {
        if (err) return callback(err, undefined);
        return callback(undefined, {
          customers: results,
          total: total
        });
      });
    });
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

  createWithFullDetails: (firstName, lastName, email, storeId, active, createDate, callback) => {
    connection.query(queries.store.getAddressIdByStoreId, [storeId], (err, storeResult) => {
      if (err) return callback(err, undefined);
      
      if (!storeResult.length) {
        return callback(new Error('Winkel niet gevonden'), undefined);
      }
      
      const addressId = storeResult[0].address_id;
      const finalCreateDate = createDate || new Date();
      
      connection.query(
        queries.customer.createWithFullDetails,
        [storeId, firstName, lastName, email, addressId, finalCreateDate, active],
        (err, result) => {
          if (err) return callback(err, undefined);
          return callback(undefined, result);
        }
      );
    });
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

  updateProfile: (customerId, updateData, callback) => {
    // Bouw dynamische update query
    const updateFields = [];
    const updateValues = [];

    if (updateData.first_name !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(updateData.first_name);
    }
    if (updateData.last_name !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(updateData.last_name);
    }
    if (updateData.email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(updateData.email);
    }

    if (updateFields.length === 0) {
      return callback(new Error('Geen velden om bij te werken'), undefined);
    }

    updateFields.push('last_update = NOW()');
    updateValues.push(customerId);

    const query = `UPDATE customer SET ${updateFields.join(', ')} WHERE customer_id = ?`;

    connection.query(query, updateValues, (err, results) => {
      if (err) return callback(err, undefined);
      return callback(undefined, results);
    });
  },

  delete: (customerId, callback) => {
    connection.query(queries.customer.delete, [customerId], (err, result) => {
      if (err) return callback(err, undefined);
      return callback(undefined, result);
    });
  },

  cascadeDelete: (customerId, callback) => {
    connection.getConnection((err, conn) => {
      if (err) return callback(err, undefined);

      conn.beginTransaction((err) => {
        if (err) {
          conn.release();
          return callback(err, undefined);
        }

        // Delete payments
        conn.query(queries.payment.deleteByCustomerId, [customerId], (err) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              callback(err, undefined);
            });
          }

          // Delete rentals
          conn.query(queries.rental.deleteByCustomerId, [customerId], (err) => {
            if (err) {
              return conn.rollback(() => {
                conn.release();
                callback(err, undefined);
              });
            }

            // Delete customer
            conn.query(queries.customer.delete, [customerId], (err, result) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  callback(err, undefined);
                });
              }

              conn.commit((err) => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    callback(err, undefined);
                  });
                }
                conn.release();
                callback(undefined, result);
              });
            });
          });
        });
      });
    });
  },
};

module.exports = customersDao;
