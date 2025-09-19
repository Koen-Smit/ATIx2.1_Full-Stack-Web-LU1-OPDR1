const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login?msg=login_required');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login?msg=login_required');
    }
    
    if (!req.session.user.admin) {
        return res.redirect('/?msg=access_denied');
    }
    
    next();
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    redirectIfLoggedIn
};