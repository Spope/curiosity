var Q = require('q');
var assert  = require('assert');
var fs      = require('fs');
var colors   = require('colors');
var config  = require('../../config/config');
var connection = require('../connection').getConnection(config.db, true);

var Download;

var html;
var list;



///////////
/////Tests
///////////
describe('Download', function() {

    before(function(done){
        resetApp().then(function(){
            Download = require('../download')(connection);
            Download.side = 'Right';
            Download.camera = 'B';

            Download.getPreviousParsedSol().then(function(lastParsedSol){
                Download.previousSol = lastParsedSol[0].sol;
                done();
            });
        }).done();

    });

    //Configuration of test data
    /*
    beforeEach(function(done) {
        this.timeout(10000);

        Download = require('../download')(connection);
        Download.side = 'Left';
        Download.camera = 'B';

        Download.getPreviousParsedSol().then(function(lastParsedSol){
            Download.previousSol = lastParsedSol[0].sol;
            done();
        });
    });
    */

    after(function(done){
        resetApp().then(function(){
            done();
        }).done();
    });


    describe('getAddresses', function() {

        //Get new sols to parse
        it('should return the url superior to saved sol', function(done) {
            this.timeout(6000);

            Download.getAddresses().then(function() {

                var length = Download._urls.length;
                assert.equal(Download._urls[length - 1], 494);
                done();
            }).done(null, done);

        });
    });

    describe('loadPage', function(){

        it('should load the page from a URL', function(done) {
            this.timeout(6000);
            var sol = Download._urls[Download._urls.length - 1];

            Download.loadPage(sol, function(body){
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
            list = Download.parse(html, 494);
            assert.equal(list.length, 13);
        });
    });

    describe('the download part', function(){

        beforeEach(function(done) {
            this.timeout(10000);

            resetApp().then(done).done();
        });

        it('saveImg should download the given img', function(done){
            this.timeout(8000);
            var pic = list[0];
            var name = 'THIS_IS_A_TEST_PIC.jpg';

            Download.saveImg(pic, name).then(function(){
                var pictures = fs.readdirSync("exports/RightB/");
                assert.equal(pictures[0], name);

                done();
            }).done();
        });

        it('savePicture should save picture into database', function(done){
            this.timeout(8000);
            var pic = list[0];

            Download.savePicture(pic).then(function(){

                connection('pictures').select().orderBy('id', 'desc').limit('1').then(function(rows){

                    assert.equal(rows[0].original_name, pic.originalName);

                    done();
                }).done();
            }).done();
        });

        it('download should download the 13 pictures from given URLs', function(done){
            this.timeout(8000);

            var p = Download.download(list, function(){
                var pictures = fs.readdirSync("exports/RightB/");
                assert.equal(pictures.length, 13);
                done();
            });
        });
    });

});






//////////////
///////TOOLS
//////////////

var emptyFolder = function(folder){
    var pics = fs.readdirSync(folder);
    for(var i in pics){
        fs.unlinkSync(folder+pics[i]);
    }
}

var resetDb = function(){
    var defer = Q.defer();

    if(connection.client.pool.client.connectionSettings.database.search('_test') == -1) {
        throw new Error("It seems that this is not a test database (and this will perform a massivre DROP...)");
    }

    //resetting the database
    fs.readFile('config/db.sql', 'utf8', function(err, data) {

        data = 'set foreign_key_checks = 0; '+data+' set foreign_key_checks = 1;';
        connection.raw(data).then(function(){
            defer.resolve();
        },function(){
            defer.reject();
        }).done();
    });

    return defer.promise;
};

var resetApp = function(){
    emptyFolder('exports/RightB/');
    emptyFolder('exports/merge/');

    return resetDb();
}
