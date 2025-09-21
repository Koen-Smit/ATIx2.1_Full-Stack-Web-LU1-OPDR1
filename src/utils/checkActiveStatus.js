/**
 * Middleware to check if user account is active
 * Redirects inactive users to profile page with error message
 * Always allows access to home, profile.
*/
const logger = require('./logger');

const checkActiveStatus = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    // Define allowed routes for inactive users
    const allowedRoutes = [
        '/',
        '/auth/profile',
        '/auth/logout',
        '/auth/activate'
    ];

    const isAllowedRoute = allowedRoutes.some(route => {
        if (route === '/') {
            return req.path === '/';
        }
        return req.path.startsWith(route);
    });

    if (req.session.user.active === 0 && !isAllowedRoute) {
        logger.warn({ 
            label: 'AUTH', 
            message: 'Inactive user attempted to access restricted route', 
            staff_id: req.session.user.staff_id,
            attempted_route: req.path
        });

        return res.redirect('/auth/profile?error=' + encodeURIComponent('Je account is niet actief. Activeer je account om toegang te krijgen tot deze pagina.'));
    }

    next();
};

module.exports = checkActiveStatus;