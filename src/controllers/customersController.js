const customersService = require('../services/customersService');

const customersController = {
    validate: (req, res, next) => {
        const { first_name, last_name } = req.body;
        if (!first_name || !last_name) {
            return res.status(400).send('First name and last name are required.');
        }
        next();
    },
    get: (req, res, next) => {
        const customerId = req.params.customerId;
        customersService.get(customerId, (error, customers) => {
            if (error) return next(error);
            res.render('customers', {
                customers,
                query: req.query
            });
        });
    },

    create: (req, res, next) => {
        const { first_name, last_name } = req.body;
        customersService.create(first_name, last_name, (error) => {
            if (error) return next(error);
            res.redirect('/customers');
        });
    },

    update: (req, res, next) => {
        const customerId = req.params.customerId;
        const { first_name, last_name } = req.body;
        customersService.update(customerId, first_name, last_name, (error) => {
            if (error) return next(error);
            res.redirect('/customers');
        });
    },

    delete: (req, res, next) => {
        const customerId = req.params.customerId;
        customersService.delete(customerId, (error) => {
            if (error) {
                if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                    return res.redirect('/customers?delete_error=1');
                }
                return next(error);
            }
            res.redirect('/customers');
        });
    }
};

module.exports = customersController;
