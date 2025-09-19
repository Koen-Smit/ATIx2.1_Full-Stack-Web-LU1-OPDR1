const filmsService = require('../services/film.service');
const { validateData, Joi } = require('../utils/validator');

const rentalSchema = Joi.object({
  customer_id: Joi.number().integer().min(1).required(),
  film_id: Joi.number().integer().min(1).required()
});

const filmsController = {
    get: (req, res, next) => {
        const filmId = req.params.filmId;
        const searchQuery = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 12; // Per page
        const offset = (page - 1) * limit;

        if (filmId) {
            // Film detail
            filmsService.getByIdWithDetails(filmId, (error, film) => {
                if (error) return next(error);
                if (!film) {
                    const err = new Error('Film niet gevonden');
                    err.status = 404;
                    return next(err);
                }

                filmsService.getAllCustomers((customerError, customers) => {
                    if (customerError) return next(customerError);
                    
                    res.render('film-profile', {
                        title: `Film - ${film.title}`,
                        film,
                        customers: customers || [],
                        flash: req.session.flash || null
                    });
                    
                    delete req.session.flash;
                });
            });
        } else {
            filmsService.getWithSearch(searchQuery, limit, offset, (error, result) => {
                if (error) return next(error);
                
                const totalPages = Math.ceil(result.total / limit);
                
                res.render('films', {
                    title: 'Films Beheer',
                    films: result.films,
                    query: req.query,
                    currentPage: page,
                    totalPages: totalPages,
                    totalFilms: result.total
                });
            });
        }
    },

    createRental: (req, res, next) => {
        try {
            const data = validateData(rentalSchema, req.body, { usePattern: false });
            
            const staffId = req.session.user.staff_id || 1; // fallback naar 1 als geen staff_id
            
            filmsService.createRental(data.film_id, data.customer_id, staffId, (err) => {
                if (err) {
                    req.session.flash = {
                        type: 'danger',
                        message: `Fout bij verhuren: ${err.message}`
                    };
                } else {
                    req.session.flash = {
                        type: 'success',
                        message: 'Film succesvol verhuurd!'
                    };
                }
                res.redirect(`/films/${data.film_id}`);
            });
        } catch (error) {
            return next(error);
        }
    }
};

module.exports = filmsController;