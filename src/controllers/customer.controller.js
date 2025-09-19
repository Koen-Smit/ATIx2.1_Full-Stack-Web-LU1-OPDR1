const customersService = require('../services/customer.service');
const { validateData, Joi } = require('../utils/validator');

const customerSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().optional().allow('').max(255),
  active: Joi.number().integer().min(0).max(1).default(1),
  create_date: Joi.date().optional()
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional().allow('').max(255)
});


const customersController = {
    get: (req, res, next) => {
        const customerId = req.params.customerId;
        const searchQuery = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 12; // Per page
        const offset = (page - 1) * limit;

        if (customerId) {
            const sortBy = req.query.sort || 'rental_date';
            const sortOrder = req.query.order || 'DESC';
            
            customersService.getByIdWithDetails(customerId, (error, customer) => {
                if (error) return next(error);
                if (!customer) {
                    const err = new Error('Klant niet gevonden');
                    err.status = 404;
                    return next(err);
                }
                
                customersService.getRentals(customerId, sortBy, sortOrder, (rentalError, rentals) => {
                    if (rentalError) return next(rentalError);
                    
                    res.render('customer-profile', {
                        title: `Klantprofiel - ${customer.first_name} ${customer.last_name}`,
                        customer,
                        rentals: rentals || [],
                        currentSort: sortBy,
                        currentOrder: sortOrder,
                        flash: req.session.flash || null
                    });
                    
                    delete req.session.flash;
                });
            });
        } else {
            customersService.getWithSearch(searchQuery, limit, offset, (error, result) => {
                if (error) return next(error);
                
                const totalPages = Math.ceil(result.total / limit);
                
                res.render('customer', {
                    title: 'Klanten Beheer',
                    customers: result.customers,
                    query: req.query,
                    currentPage: page,
                    totalPages: totalPages,
                    totalCustomers: result.total
                });
            });
        }
    },

    create: (req, res, next) => {
        try {
            const data = validateData(customerSchema, req.body, { usePattern: true });
            
            // Store_id and address_id from logged in user
            const userStoreId = req.session.user.store_id;
            
            customersService.createWithFullDetails(
                data.first_name, 
                data.last_name, 
                data.email,
                userStoreId,
                data.active,
                data.create_date,
                (err) => {
                    if (err) return next(err);
                    res.redirect('/customers');
                }
            );
        } catch (error) {
            return next(error);
        }
    },

    profile: (req, res, next) => {
        const customerId = req.params.customerId;
        const sortBy = req.query.sort || 'rental_date';
        const sortOrder = req.query.order || 'DESC';
        
        customersService.getByIdWithDetails(customerId, (error, customer) => {
            if (error) return next(error);
            if (!customer) {
                const err = new Error('Klant niet gevonden');
                err.status = 404;
                return next(err);
            }
            
            // Verhuurgeschiedenis
            customersService.getRentals(customerId, sortBy, sortOrder, (rentalError, rentals) => {
                if (rentalError) return next(rentalError);
                
                res.render('customer-profile', {
                    title: `Klantprofiel - ${customer.first_name} ${customer.last_name}`,
                    customer,
                    rentals: rentals || [],
                    currentSort: sortBy,
                    currentOrder: sortOrder
                });
            });
        });
    },

    updateProfile: (req, res, next) => {
        const customerId = req.params.customerId;
        
        try {
            const data = validateData(updateProfileSchema, req.body, { usePattern: false });
            
            customersService.updateProfile(customerId, data, (error) => {
                if (error) return next(error);
                
                req.session.flash = {
                    type: 'success',
                    message: 'Profiel succesvol bijgewerkt!'
                };
                res.redirect(`/customers/${customerId}`);
            });
        } catch (error) {
            return next(error);
        }
    },

    delete: (req, res, next) => {
        const customerId = req.params.customerId;
        
        customersService.cascadeDelete(customerId, (error) => {
            if (error) {
                const deleteError = new Error('Er is een fout opgetreden bij het verwijderen van de klant en gerelateerde gegevens.');
                deleteError.status = 500;
                return next(deleteError);
            }
            
            req.session.flash = {
                type: 'success', 
                message: 'Klant en alle gerelateerde gegevens zijn succesvol verwijderd.'
            };
            res.redirect('/customers');
        });
    }
};

module.exports = customersController;
