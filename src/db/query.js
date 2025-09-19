const queries = {
  customer: {
    getAll: `SELECT * FROM customer ORDER BY customer_id DESC`,
    getAllPaginated: `SELECT * FROM customer ORDER BY customer_id DESC LIMIT ? OFFSET ?`,
    getById: `SELECT * FROM customer WHERE customer_id = ?`,
    getByIdWithDetails: `
      SELECT 
        c.*,
        s.store_id,
        s.manager_staff_id,
        sa.address as store_address,
        sa.address2 as store_address2,
        sa.district as store_district,
        sa.city_id as store_city_id,
        sa.postal_code as store_postal_code,
        sa.phone as store_phone,
        sc.city as store_city,
        sco.country as store_country,
        ca.address as customer_address,
        ca.address2 as customer_address2,
        ca.district as customer_district,
        ca.city_id as customer_city_id,
        ca.postal_code as customer_postal_code,
        ca.phone as customer_phone,
        cc.city as customer_city,
        cco.country as customer_country
      FROM customer c
      LEFT JOIN store s ON c.store_id = s.store_id
      LEFT JOIN address sa ON s.address_id = sa.address_id
      LEFT JOIN city sc ON sa.city_id = sc.city_id
      LEFT JOIN country sco ON sc.country_id = sco.country_id
      LEFT JOIN address ca ON c.address_id = ca.address_id
      LEFT JOIN city cc ON ca.city_id = cc.city_id
      LEFT JOIN country cco ON cc.country_id = cco.country_id
      WHERE c.customer_id = ?`,
    getWithSearch: `
      SELECT * FROM customer 
      WHERE first_name LIKE ? 
         OR last_name LIKE ? 
         OR email LIKE ?
         OR customer_id = ?
      ORDER BY customer_id DESC 
      LIMIT ? OFFSET ?`,
    countAll: `SELECT COUNT(*) as total FROM customer`,
    countWithSearch: `
      SELECT COUNT(*) as total FROM customer 
      WHERE first_name LIKE ? 
         OR last_name LIKE ? 
         OR email LIKE ?
         OR customer_id = ?`,
    create: `INSERT INTO customer (store_id, first_name, last_name, address_id, create_date) VALUES (1, ?, ?, 1, NOW())`,
    createWithFullDetails: `
      INSERT INTO customer (store_id, first_name, last_name, email, address_id, create_date, active) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    update: `UPDATE customer SET first_name = ?, last_name = ? WHERE customer_id = ?`,
    updateProfile: `UPDATE customer SET first_name = ?, last_name = ?, email = ?, last_update = NOW() WHERE customer_id = ?`,
    delete: `DELETE FROM customer WHERE customer_id = ?`,
  },
  rental: {
    getByCustomerId: `
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
      ORDER BY r.rental_date DESC`,
    deleteByCustomerId: `DELETE FROM rental WHERE customer_id = ?`
  },
  payment: {
    deleteByCustomerId: `DELETE FROM payment WHERE customer_id = ?`
  },
  store: {
    getAddressIdByStoreId: `SELECT address_id FROM store WHERE store_id = ?`
  },
  film: {
    getAll: `SELECT * FROM film ORDER BY film_id DESC`,
    getAllWithRentalStatus: `
      SELECT 
        f.*,
        CASE 
          WHEN MAX(r.rental_id) IS NOT NULL AND MAX(r.return_date) IS NULL THEN 'rented'
          ELSE 'available'
        END as rental_status,
        MAX(c.customer_id) as customer_id,
        MAX(c.first_name) as customer_first_name,
        MAX(c.last_name) as customer_last_name,
        MAX(r.rental_date) as rental_date,
        MAX(r.rental_id) as rental_id
      FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      LEFT JOIN customer c ON r.customer_id = c.customer_id
      GROUP BY f.film_id, f.title, f.description, f.release_year, f.rating, f.length, f.replacement_cost, f.special_features, f.last_update
      ORDER BY f.film_id DESC`,
    getWithSearch: `
      SELECT 
        f.*,
        CASE 
          WHEN MAX(r.rental_id) IS NOT NULL AND MAX(r.return_date) IS NULL THEN 'rented'
          ELSE 'available'
        END as rental_status,
        MAX(c.customer_id) as customer_id,
        MAX(c.first_name) as customer_first_name,
        MAX(c.last_name) as customer_last_name,
        MAX(r.rental_date) as rental_date,
        MAX(r.rental_id) as rental_id
      FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      LEFT JOIN customer c ON r.customer_id = c.customer_id
      WHERE f.title LIKE ? 
         OR f.description LIKE ? 
         OR f.release_year = ?
         OR f.film_id = ?
      GROUP BY f.film_id, f.title, f.description, f.release_year, f.rating, f.length, f.replacement_cost, f.special_features, f.last_update
      ORDER BY f.film_id DESC 
      LIMIT ? OFFSET ?`,
    countAll: `SELECT COUNT(*) as total FROM film`,
    countWithSearch: `
      SELECT COUNT(DISTINCT f.film_id) as total FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      WHERE f.title LIKE ? 
         OR f.description LIKE ? 
         OR f.release_year = ?
         OR f.film_id = ?`,
    getById: `SELECT * FROM film WHERE film_id = ?`,
    getByIdWithDetails: `
      SELECT 
        f.*,
        CASE 
          WHEN r.rental_id IS NOT NULL AND r.return_date IS NULL THEN 'rented'
          ELSE 'available'
        END as rental_status,
        c.customer_id,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        r.rental_date,
        r.rental_id,
        i.inventory_id,
        p.amount as rental_amount,
        p.payment_date
      FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      LEFT JOIN customer c ON r.customer_id = c.customer_id
      LEFT JOIN payment p ON r.rental_id = p.rental_id
      WHERE f.film_id = ?`,
    createRental: `
      INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id) 
      VALUES (NOW(), ?, ?, ?)`,
    getAllPaginated: `
      SELECT 
        f.*,
        CASE 
          WHEN MAX(r.rental_id) IS NOT NULL AND MAX(r.return_date) IS NULL THEN 'rented'
          ELSE 'available'
        END as rental_status,
        MAX(c.customer_id) as customer_id,
        MAX(c.first_name) as customer_first_name,
        MAX(c.last_name) as customer_last_name,
        MAX(r.rental_date) as rental_date,
        MAX(r.rental_id) as rental_id
      FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      LEFT JOIN customer c ON r.customer_id = c.customer_id
      GROUP BY f.film_id, f.title, f.description, f.release_year, f.rating, f.length, f.replacement_cost, f.special_features, f.last_update
      ORDER BY f.film_id DESC 
      LIMIT ? OFFSET ?`
  }
};

module.exports = queries;
