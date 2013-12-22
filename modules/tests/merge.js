var assert  = require('assert');
var fs      = require('fs');
var colors  = require('colors');
var Q       = require('q');
var gm = require('gm');

var Merge = require('../merge');
Merge.side = 'Right';
Merge.camera = 'B';

var emptyFolder = function(folder){
    var pics = fs.readdirSync(folder);
    for(var i in pics){
        fs.unlinkSync(folder+pics[i]);
    }
}

describe('Merge', function() {

    before(function(done){

        this.timeout(15000);
        emptyFolder('exports/RightB/');
        emptyFolder('exports/merge/');

        var Download = require('../download');
        Download._urls = ["http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=474&camera=FHAZ_"];
        Download.camera= 'B';
        Download.side = 'Right';
        Download._end = Q.defer();
        Download.nextPage();
        Download._end.promise.then(function(){
            done();
        });
    });

    after(function(){
        emptyFolder('exports/RightB/');
        emptyFolder('exports/merge/');
    });

    describe('readFiles', function(){
        it('should return array of files', function(){
            var files = Merge._readFiles();
            assert.equal(files.length, 12);
        })
    });

    describe('resize', function(){

        it('should resize the picture to 256X256 and delete non square pictures', function(done){

            Merge._startResize(function(){

                gm('exports/RightB/2013-12-06-04-52-12.jpg').size(function (err, size) {
                    assert.equal(size.width, 256);
                    assert.equal(size.height, 256);

                    done();
                });
            });
        });
    });

    describe('rename', function(){

        it('should move the picture to the merge folder and rename it', function(done){
            this.timeout(5000);

            Merge._rename('2013-12-06-02-37-38.jpg', 'exports/RightB/', function(){
                var pics = fs.readdirSync('exports/merge/');
                assert.equal(pics.length, 1);
                assert.equal(pics[0], '00001.jpg');

                done();
            });
        });

    });

})
