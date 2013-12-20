var assert  = require('assert');
var fs      = require('fs');
var colors   = require('colors');

var Download;

var html;
var list;

describe('Download', function() {

    //Configuration of test data
    beforeEach(function(done) {
        this.timeout(10000);

        fs.writeFileSync('exports/last-sol.txt', 485);

        Download = require('../download');
        Download.side = 'Right';
        Download.camera = 'B';

        done();
    });


    describe('getAddresses', function() {

        //Get Bookmarks from a category
        it('should return the url superior to saved sol', function(done) {
            this.timeout(6000);

            Download.getAddresses().then(function() {

                var length = Download._urls.length;
                assert.equal(Download._urls[length - 1], 'http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=486&camera=FHAZ%5F');
                done();
            }).done(null, done);

        });
    });

    describe('loadPage', function(){

        it('should load the page from a URL', function(done) {
            this.timeout(6000);
            var url = Download._urls[Download._urls.length - 1];
            Download.loadPage(url, function(body){
                html = body;
                assert.notEqual('', body);
                assert.notEqual(undefined, body);
                assert.notEqual(null, body);

                done();
            });
        });
    });

    describe('parse', function(){

        it('should extract pictures URLs from the body', function(){

            list = Download.parse(html);
            assert.equal(list.length, 3)
        });
    });

    describe('download', function(){

        it('should download pictures from given URLs', function(){

            Download.download(list, function(){

                var pictures = fs.readdirSync("exports/merge/");

                console.log(pictures);
                assert.equal(pictures.length, 4);
            });
        });
    });

});
