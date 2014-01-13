var assert     = require('assert');
var fs         = require('fs');
var colors     = require('colors');
var Q          = require('q');
var gm         = require('gm');

var config     = require('../../config/config');
var connection = require('../connection').getConnection(config.db, true);
var Merge      = require('../merge')(connection);

describe('Merge', function() {

    before(function(done){

        this.timeout(15000);

        Merge.side = 'Right';
        Merge.camera = 'B';

        resetApp().then(function(){

            var Download = require('../download')(connection);
            Download._newSols = ["474"];
            Download.camera= 'B';
            Download.side = 'Right';
            Download._end = Q.defer();
            Download.nextPage();
            Download._end.promise.then(function(){
                done();
            });
        }).done();
    });

    after(function(done){
        resetApp().then(function(){
            done();
        }).done();
    });

    describe('readFiles', function(){
        it('should return array of files', function(){
            var files = Merge.readFiles();
            assert.equal(files.length, 12);
        })
    });

    describe('bigDuplication', function(){

        it('should duplicate 1024 pic to merge_big and save it to DB', function(done){
            this.timeout(5000);
            Merge.bigPicDuplication('2013-12-06-02-37-38.jpg').then(function(){

                var folder = Merge.path+'merge_big/';
                var pictures = fs.readdirSync(folder);

                assert.equal(pictures.length, 1);

                done();
            }).done();
        });

        it('should set the new name into DB _big', function(done){

            connection('pictures_big').where('temp_name', '2013-12-06-02-37-38.jpg').then(function(rows){
                assert.equal(rows[0].name, '00001.jpg');

                done();
            }).done();
            
        });
    });

    describe('resize', function(){

        it('should resize the picture to 256X256 and delete non square pictures', function(done){

            Merge.startResize(function(){

                gm('exports/RightB/2013-12-06-04-52-12.jpg').size(function (err, size) {
                    assert.equal(size.width, 256);
                    assert.equal(size.height, 256);

                    done();
                });
            });
        });
    });

    describe('saveNewName', function(){
        it('should set the new name into DB', function(done){

            Merge.saveNewName('2013-12-06-04-52-12.jpg', 'test', function(){

                connection('pictures').where('temp_name', '2013-12-06-04-52-12.jpg').select().then(function(rows){
                    assert.equal(rows[0].name, 'test.jpg');

                    done();
                }).done();
            });
            
        });
    });

    describe('rename', function(){

        it('should move the picture to the merge folder and rename it', function(done){
            this.timeout(5000);

            Merge.rename('2013-12-06-02-37-38.jpg', 'exports/RightB/', function(){
                var pics = fs.readdirSync('exports/merge/');
                assert.equal(pics.length, 1);
                assert.equal(pics[0], '00001.jpg');

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
    emptyFolder('exports/merge_big/');

    return resetDb();
}
