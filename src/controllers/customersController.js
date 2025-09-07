const customersService = require('../services/customersService');

const customersController = {
    get: (req, res, next) => {
        let customerId = req.params.customerId;
        customersService.get(customerId, (error, customers) => {
            if (error) return next(error);
            if (customers) res.render('customers', { customers: customers });
        });
    },

    delete: (req, res, next) => {
        let customerId = req.body.customer_id;
        customersService.delete(customerId, (error) => {
            if (error) return next(error);
            customersService.get(null, (err, customers) => {
                if (err) return next(err);
                res.render('customers', { customers });
            });
        });
    },
};

module.exports = customersController;