var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');
var Q       = require('q');
var colors  = require('colors');

var Download= require('./modules/download');
var Merge   = require('./modules/merge');
var Video   = require('./modules/video');


Download.loadPics(function(){
    //Merge.merge(function(){
        //Video.convert();
    //});
});


//Video.convert();
