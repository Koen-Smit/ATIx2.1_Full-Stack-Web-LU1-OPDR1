const connection = require('../db/connection');

const authDAO = {
    getUserByEmail: (email, callback) => {
        const query = `
            SELECT s.staff_id, s.first_name, s.last_name, s.email, s.username, 
                   s.password, s.store_id, s.active, s.admin
            FROM staff s
            WHERE s.email = ?
        `;
        connection.query(query, [email], callback);
    },

    getUserByUsername: (username, callback) => {
        const query = `
            SELECT s.staff_id, s.first_name, s.last_name, s.email, s.username, 
                   s.password, s.store_id, s.active, s.admin
            FROM staff s
            WHERE s.username = ?
        `;
        connection.query(query, [username], callback);
    },

    checkEmailExists: (email, callback) => {
        const query = 'SELECT COUNT(*) as count FROM staff WHERE email = ?';
        connection.query(query, [email], callback);
    },

    checkUsernameExists: (username, callback) => {
        const query = 'SELECT COUNT(*) as count FROM staff WHERE username = ?';
        connection.query(query, [username], callback);
    },

    createUser: (userData, callback) => {
        const getStoreAddressQuery = 'SELECT address_id FROM store WHERE store_id = ?';
        
        connection.query(getStoreAddressQuery, [userData.store_id], (error, storeResults) => {
            if (error) return callback(error);
            
            if (storeResults.length === 0) {
                return callback(new Error('Selected store not found'));
            }
            
            const storeAddressId = storeResults[0].address_id;
            
            const insertQuery = `
                INSERT INTO staff (first_name, last_name, address_id, picture, email, 
                                 store_id, active, username, password, last_update, admin)
                VALUES (?, ?, ?, NULL, ?, ?, 0, ?, ?, NOW(), 0)
            `;
            const values = [
                userData.first_name,
                userData.last_name,
                storeAddressId,
                userData.email,
                userData.store_id,
                userData.username,
                userData.password
            ];
            
            connection.query(insertQuery, values, callback);
        });
    },

    // Get all stores for registration dropdown
    getAllStores: (callback) => {
        const query = `
            SELECT s.store_id, CONCAT(a.address, ', ', c.city) as address
            FROM store s
            JOIN address a ON s.address_id = a.address_id
            JOIN city c ON a.city_id = c.city_id
            ORDER BY c.city, a.address
        `;
        connection.query(query, [], callback);
    },

    getUserProfileById: (staffId, callback) => {
        const query = `
            SELECT 
                s.staff_id,
                s.first_name,
                s.last_name,
                s.email,
                s.username,
                s.active,
                s.last_update as profile_last_update,
                st.store_id,
                CONCAT(a.address, ', ', c.city, ', ', co.country) as store_address,
                st.manager_staff_id,
                CONCAT(m.first_name, ' ', m.last_name) as manager_name
            FROM staff s
            LEFT JOIN store st ON s.store_id = st.store_id
            LEFT JOIN address a ON st.address_id = a.address_id
            LEFT JOIN city c ON a.city_id = c.city_id
            LEFT JOIN country co ON c.country_id = co.country_id
            LEFT JOIN staff m ON st.manager_staff_id = m.staff_id
            WHERE s.staff_id = ?
        `;
        connection.query(query, [staffId], callback);
    },

    // Activate user account by setting active = 1
    activateUserAccount: (staffId, callback) => {
        const query = `
            UPDATE staff 
            SET active = 1, last_update = NOW() 
            WHERE staff_id = ?
        `;
        connection.query(query, [staffId], callback);
    },

    checkEmailExistsForOtherUser: (email, staffId, callback) => {
        const query = 'SELECT COUNT(*) as count FROM staff WHERE email = ? AND staff_id != ?';
        connection.query(query, [email, staffId], callback);
    },

    checkUsernameExistsForOtherUser: (username, staffId, callback) => {
        const query = 'SELECT COUNT(*) as count FROM staff WHERE username = ? AND staff_id != ?';
        connection.query(query, [username, staffId], callback);
    },

    updateUserProfile: (staffId, profileData, callback) => {
        const query = `
            UPDATE staff 
            SET first_name = ?, last_name = ?, email = ?, username = ?, last_update = NOW()
            WHERE staff_id = ?
        `;
        const values = [
            profileData.first_name,
            profileData.last_name,
            profileData.email,
            profileData.username,
            staffId
        ];
        connection.query(query, values, callback);
    },

    updatePassword: (staffId, hashedPassword, callback) => {
        const query = `
            UPDATE staff 
            SET password = ?, last_update = NOW()
            WHERE staff_id = ?
        `;
        connection.query(query, [hashedPassword, staffId], callback);
    }
};

module.exports = authDAO;