const userDao = require('../dao/usersDao');
const logger = require('../utils/logger');
const usersService={
    get:(userId, callback)=>{
        userDao.get(userId, (err, users) =>{
            if(err) return callback(err, undefined);

            if(users){
                // logger.debug(users)
                return callback(undefined, users);
            } else {
                return callback(undefined, []);
            }

        });
    },
    delete:(userId, callback)=>{
        userDao.delete(userId, (err, users) =>{
            if(err) return callback(err, undefined);
            if(users){
                if(userId === undefined) return callback(undefined, users)

                let user = users.filter(user => user.id == userId)[0];
                if (!user) return callback(undefined, []);
                return callback(undefined, [user]);
            }

        });
    },
}

module.exports = usersService;