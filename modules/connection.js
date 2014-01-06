var Knex = require('knex');

module.exports = function(config, test){

    var data = {
        host     : config.host,
        database : config.database,
        user     : config.user,
        password : config.password,
        charset  : 'utf8'
    }

    if(test) {
        data.database = config.database_test;
        data.multipleStatements = true;
    }

    var knex = Knex.initialize({
        client: 'mysql',
        connection: data
    });

    return knex;
}
