var colors  = require('colors');

var Download= require('./modules/download');
var Merge   = require('./modules/merge');
var Video   = require('./modules/video');


Download.loadPics(function(){
    Merge.merge(function(){
        Video.convert();
    });
});

