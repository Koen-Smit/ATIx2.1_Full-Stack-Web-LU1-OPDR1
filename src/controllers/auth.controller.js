const authService = require('../services/auth.service');
const { validateData, Joi } = require('../utils/validator');
const logger = require('../utils/logger');

// Validation schemas
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
});

const registerSchema = Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(50).alphanum().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('(?=.*[a-z])')) // minimaal 1 kleine letter
        .pattern(new RegExp('(?=.*[A-Z])')) // minimaal 1 hoofdletter
        .pattern(new RegExp('(?=.*[0-9])')) // minimaal 1 cijfer
        .pattern(new RegExp('(?=.*[!@#$%^&*])')) // minimaal 1 speciaal teken
        .required()
        .messages({
            'string.min': 'Wachtwoord moet minimaal 8 karakters lang zijn',
            'string.pattern.base': 'Wachtwoord moet minimaal 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal teken (!@#$%^&*) bevatten'
        }),
    confirm_password: Joi.string().min(8).required(),
    store_id: Joi.number().integer().positive().required()
});

const authController = {
    getLogin: (req, res, next) => {
        if (req.session.user) {
            return res.redirect('/');
        }
        
        res.render('login', { 
            title: 'Inloggen'
        });
    },

    postLogin: (req, res, next) => {
        try {
            logger.info({ label: 'AUTH', message: 'Login attempt', email: req.body.email });
            const data = validateData(loginSchema, req.body);
            
            authService.getUserByEmail(data.email, (error, user) => {
                if (error) return next(error);
                
                if (!user) {
                    const err = new Error('Ongeldig e-mailadres of wachtwoord');
                    err.status = 401;
                    return next(err);
                }
                
                const isMatch = authService.verifyPassword(data.password, user.password);
                
                if (!isMatch) {
                    const error = new Error('Ongeldig e-mailadres of wachtwoord');
                    error.status = 401;
                    return next(error);
                }
                
                // Create session
                req.session.user = {
                    staff_id: user.staff_id,
                    name: `${user.first_name} ${user.last_name}`,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    username: user.username,
                    store_id: user.store_id,
                    admin: user.admin,
                    active: user.active
                };
                
                res.redirect('/');
            });
        } catch (error) {
            return next(error);
        }
    },

    getRegister: (req, res, next) => {
        // Redirect if already logged in
        if (req.session.user) {
            return res.redirect('/');
        }
        
        // Stores for dropdown
        authService.getAllStores((error, stores) => {
            if (error) return next(error);
            
            res.render('register', { 
                title: 'Registreren',
                stores: stores
            });
        });
    },

    postRegister: (req, res, next) => {
        try {
            logger.info({ label: 'AUTH', message: 'Registration attempt', email: req.body.email });
            
            const nameData = validateData(Joi.object({
                first_name: Joi.string().min(2).max(50).required(),
                last_name: Joi.string().min(2).max(50).required()
            }), { 
                first_name: req.body.first_name, 
                last_name: req.body.last_name 
            }, { usePattern: true });
            
            const data = validateData(registerSchema, req.body);
            
            // Check if passwords match
            if (data.password !== data.confirm_password) {
                const err = new Error('Wachtwoorden komen niet overeen');
                err.status = 400;
                return next(err);
            }
            
            // Check if email exists
            authService.checkEmailExists(data.email, (error, emailExists) => {
                if (error) {
                    logger.error({ label: 'AUTH', message: 'Database error checking email', error: error.message });
                    return next(error);
                }
                
                if (emailExists) {
                    logger.warn({ label: 'AUTH', message: 'Registration failed - email exists', email: data.email });
                    const err = new Error('E-mailadres is al in gebruik');
                    err.status = 400;
                    return next(err);
                }
                
                // Check if username exists
                authService.checkUsernameExists(data.username, (error, usernameExists) => {
                    if (error) return next(error);
                    
                    if (usernameExists) {
                        const err = new Error('Gebruikersnaam is al in gebruik');
                        err.status = 400;
                        return next(err);
                    }
                    
                    const hashedPassword = authService.hashPassword(data.password);
                    
                    logger.info({ label: 'AUTH', message: 'Password hashed successfully', hashLength: hashedPassword.length });
                    
                    const userData = {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        username: data.username,
                        password: hashedPassword,
                        store_id: data.store_id
                    };
                    
                    // Create user
                    authService.createUser(userData, (error, result) => {
                        if (error) {
                            logger.error({ label: 'AUTH', message: 'Database error creating user', error: error.message });
                            return next(error);
                        }
                        
                        logger.info({ label: 'AUTH', message: 'Registration successful', user_id: result.staff_id, email: data.email });
                        
                        res.redirect('/auth/login?success=' + encodeURIComponent('Account succesvol aangemaakt! Je kunt nu inloggen.'));
                    });
                });
            });
        } catch (error) {
            logger.error({ label: 'AUTH', message: 'Registration validation error', error: error.message });
            return next(error);
        }
    },

    logout: (req, res, next) => {
        req.session.destroy((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    },

    getProfile: (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        authService.getUserProfileById(req.session.user.staff_id, (error, userProfile) => {
            if (error) {
                logger.error({ label: 'AUTH', message: 'Error fetching user profile', error: error.message });
                return next(error);
            }

            if (!userProfile) {
                logger.warn({ label: 'AUTH', message: 'User profile not found', staff_id: req.session.user.staff_id });
                return res.redirect('/auth/login');
            }

            logger.info({ label: 'AUTH', message: 'Profile page accessed', staff_id: req.session.user.staff_id });

            res.render('profile', {
                title: 'Mijn Profiel',
                user: userProfile
            });
        });
    },

    postActivateAccount: (req, res, next) => {
        try {
            if (!req.session.user) {
                return res.redirect('/auth/login');
            }

            const { activationKey } = req.body;
            const staffId = req.session.user.staff_id;

            logger.info({ label: 'AUTH', message: 'Account activation attempt', staff_id: staffId });

            if (!activationKey) {
                const err = new Error('Activatiecode is verplicht');
                err.status = 400;
                return next(err);
            }

            // Check if activation key matches SECRET_KEY from env
            if (activationKey !== process.env.SECRET_KEY) {
                logger.warn({ label: 'AUTH', message: 'Invalid activation key used', staff_id: staffId });
                return res.redirect('/auth/profile?error=' + encodeURIComponent('Ongeldige activatiecode. Probeer opnieuw.'));
            }

            // Activate the user account
            authService.activateUserAccount(staffId, (error, result) => {
                if (error) {
                    logger.error({ label: 'AUTH', message: 'Database error activating account', error: error.message, staff_id: staffId });
                    return next(error);
                }

                req.session.user.active = 1;

                logger.info({ label: 'AUTH', message: 'Account successfully activated', staff_id: staffId });

                res.redirect('/auth/profile?success=' + encodeURIComponent('Je account is succesvol geactiveerd! Je hebt nu toegang tot alle functies.'));
            });

        } catch (error) {
            logger.error({ label: 'AUTH', message: 'Account activation error', error: error.message });
            return next(error);
        }
    },

    postEditProfile: (req, res, next) => {
        try {
            if (!req.session.user) {
                return res.redirect('/auth/login');
            }

            const staffId = req.session.user.staff_id;
            
            logger.info({ label: 'AUTH', message: 'Profile edit attempt', staff_id: staffId });

            const nameData = validateData(Joi.object({
                first_name: Joi.string().min(2).max(50).required(),
                last_name: Joi.string().min(2).max(50).required()
            }), { 
                first_name: req.body.first_name, 
                last_name: req.body.last_name 
            }, { usePattern: true });

            const profileData = validateData(Joi.object({
                first_name: Joi.string().min(2).max(50).required(),
                last_name: Joi.string().min(2).max(50).required(),
                email: Joi.string().email().required(),
                username: Joi.string().min(3).max(50).alphanum().required()
            }), req.body);

            // Check if email exists for other users
            authService.checkEmailExistsForOtherUser(profileData.email, staffId, (error, emailExists) => {
                if (error) {
                    logger.error({ label: 'AUTH', message: 'Database error checking email', error: error.message });
                    return next(error);
                }
                
                if (emailExists) {
                    logger.warn({ label: 'AUTH', message: 'Profile edit failed - email exists for other user', email: profileData.email, staff_id: staffId });
                    return res.redirect('/auth/profile?error=' + encodeURIComponent('E-mailadres is al in gebruik door een andere gebruiker'));
                }
                
                // Check if username exists for other users
                authService.checkUsernameExistsForOtherUser(profileData.username, staffId, (error, usernameExists) => {
                    if (error) return next(error);
                    
                    if (usernameExists) {
                        logger.warn({ label: 'AUTH', message: 'Profile edit failed - username exists for other user', username: profileData.username, staff_id: staffId });
                        return res.redirect('/auth/profile?error=' + encodeURIComponent('Gebruikersnaam is al in gebruik door een andere gebruiker'));
                    }
                    
                    // Update user profile
                    authService.updateUserProfile(staffId, profileData, (error, result) => {
                        if (error) {
                            logger.error({ label: 'AUTH', message: 'Database error updating profile', error: error.message, staff_id: staffId });
                            return next(error);
                        }

                        req.session.user.first_name = profileData.first_name;
                        req.session.user.last_name = profileData.last_name;
                        req.session.user.name = `${profileData.first_name} ${profileData.last_name}`;
                        req.session.user.email = profileData.email;
                        req.session.user.username = profileData.username;

                        logger.info({ label: 'AUTH', message: 'Profile successfully updated', staff_id: staffId });

                        res.redirect('/auth/profile?success=' + encodeURIComponent('Je profiel is succesvol bijgewerkt!'));
                    });
                });
            });

        } catch (error) {
            logger.error({ label: 'AUTH', message: 'Profile edit validation error', error: error.message });
            return res.redirect('/auth/profile?error=' + encodeURIComponent('Ongeldige gegevens. Controleer je invoer en probeer opnieuw.'));
        }
    }
};

module.exports = authController;