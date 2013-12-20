var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');
var Q       = require('q');
var colors  = require('colors');

var Download= require('./modules/download');
var Merge   = require('./modules/merge');


//Download.loadPics(side, camera).then(function(){

    //return Merge.merge();
//}).then(function(){

    //console.log('Pictures resized'.green)
//});

Download.loadPics(function(){
    Merge.merge();
})
