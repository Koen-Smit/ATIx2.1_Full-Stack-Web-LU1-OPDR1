const customersService = require('../services/customer.service');
const { validateData, Joi } = require('../utils/validator');

const customerSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
});


const customersController = {
    get: (req, res, next) => {
        const customerId = req.params.customerId;
        customersService.get(customerId, (error, customers) => {
            if (error) return next(error);
            res.render('customer', {
                customers,
                query: req.query
            });
        });
    },

    create: (req, res, next) => {
        try {
            const data = validateData(customerSchema, req.body, { usePattern: true });
            customersService.create(data.first_name, data.last_name, (err) => {
                if (err) return next(err);
                res.redirect('/customers');
            });
        } catch (error) {
            return next(error);
        }
    },

    update: (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const data = validateData(customerSchema, req.body, { usePattern: true });
            customersService.update(customerId, data.first_name, data.last_name, (error) => {
                if (error) return next(error);
                res.redirect('/customers');
            });
        } catch (error) {
            return next(error);
        }
    },

    delete: (req, res, next) => {
        const customerId = req.params.customerId;
        customersService.delete(customerId, (error) => {
            if (error) {
                if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                    const deleteError = new Error('Deze klant kan niet worden verwijderd omdat er andere gerelateerde informatie is.');
                    deleteError.status = 400;
                    return next(deleteError);
                }
                return next(error);
            }
            res.redirect('/customers');
        });
    }
};

module.exports = customersController;
