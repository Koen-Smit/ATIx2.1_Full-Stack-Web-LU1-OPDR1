const authDAO = require('../daos/auth.dao');
const { callDao } = require('../utils/serviceHelper');

const authService = {
    getUserByEmail: (email, callback) => {
        callDao(authDAO.getUserByEmail, [email], (error, results) => {
            if (error) return callback(error);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    },

    getUserByUsername: (username, callback) => {
        callDao(authDAO.getUserByUsername, [username], (error, results) => {
            if (error) return callback(error);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    },

    checkEmailExists: (email, callback) => {
        callDao(authDAO.checkEmailExists, [email], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count > 0);
        });
    },

    checkUsernameExists: (username, callback) => {
        callDao(authDAO.checkUsernameExists, [username], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count > 0);
        });
    },

    createUser: (userData, callback) => {
        callDao(authDAO.createUser, [userData], (error, results) => {
            if (error) return callback(error);
            callback(null, { 
                staff_id: results.insertId,
                message: 'User created successfully'
            });
        });
    },

    getAllStores: (callback) => {
        callDao(authDAO.getAllStores, [], callback);
    },

    getUserProfileById: (staffId, callback) => {
        callDao(authDAO.getUserProfileById, [staffId], (error, results) => {
            if (error) return callback(error);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    },

    activateUserAccount: (staffId, callback) => {
        callDao(authDAO.activateUserAccount, [staffId], (error, results) => {
            if (error) return callback(error);
            callback(null, { 
                success: true,
                message: 'Account activated successfully'
            });
        });
    },

    checkEmailExistsForOtherUser: (email, staffId, callback) => {
        callDao(authDAO.checkEmailExistsForOtherUser, [email, staffId], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count > 0);
        });
    },

    checkUsernameExistsForOtherUser: (username, staffId, callback) => {
        callDao(authDAO.checkUsernameExistsForOtherUser, [username, staffId], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count > 0);
        });
    },

    updateUserProfile: (staffId, profileData, callback) => {
        callDao(authDAO.updateUserProfile, [staffId, profileData], (error, results) => {
            if (error) return callback(error);
            callback(null, { 
                success: true,
                message: 'Profile updated successfully'
            });
        });
    }
};

module.exports = authService;