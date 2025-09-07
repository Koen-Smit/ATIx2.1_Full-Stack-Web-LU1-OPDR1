const usersService = require('../services/usersService');

const usersController = {
    get:(req, res, next)=>{
    let userId = req.params.userId;
    usersService.get(userId, (error, users)=>{
        if(error) next(error);
        if(users) res.render('users', {users: users});
    });
},

delete: (req, res, next) => {
    let userId = req.body.customer_id;
    usersService.delete(userId, (error) => {
        if (error) return next(error);
        usersService.get(null, (err, users) => {
            if (err) return next(err);
            res.render('users', { users });
        });
    });
},
};

module.exports = usersController;