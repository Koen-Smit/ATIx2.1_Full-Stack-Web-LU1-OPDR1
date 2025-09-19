/**
 * Wrapper functie voor DAO calls om herhaalde error handling te voorkomen
 */
function callDao(daoFunction, params, callback, transformer = null) {
    daoFunction(...params, (err, result) => {
        if (err) return callback(err, undefined);
        
        const finalResult = transformer ? transformer(result) : result;
        return callback(undefined, finalResult);
    });
}


function callDaoArray(daoFunction, params, callback) {
    callDao(daoFunction, params, callback, (result) => result || []);
}

module.exports = {
    callDao,
    callDaoArray
};