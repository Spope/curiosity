var colors  = require('colors');
var Knex = require('knex');
var config  = require('./config/config');
var connection = require('./modules/connection').getConnection(config.db, false);

var Download= require('./modules/download')(connection);
var Merge   = require('./modules/merge')(connection);
var Video   = require('./modules/video');

Download.loadPics(function(){
    Merge.merge(function(){
        Video.convert();

        connection.client.pool.destroy();
    });
});

//JSON generation
//SELECT `sol`, COUNT( `id`) AS 'pictures' FROM `pictures` GROUP BY `sol`


