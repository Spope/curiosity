var fs = require('fs-extra');
var gm = require('gm').subClass({ imageMagick: true });;
var Q  = require('q');

module.exports = function(connection){

    return {
        cameras: ['A', 'B'],
        sides: ['Left', 'Right'],
        camera: null,
        side: null,
        path: 'exports/',

        _picNumber: fs.readdirSync('exports/merge/').length,
        _picNumberBig: fs.readdirSync('exports/merge_big/').length,

        merge: function(callback){
            var si = 0;
            var ci = 0;
            var that = this;
            console.log('start moving files'.cyan);
            var loop = function(sides, cameras){
                that.start(that.sides[si], that.cameras[ci], function(){
                    console.log('moving '.cyan+that.sides[si].cyan+that.cameras[ci].cyan);
                    ci++;
                    if(ci < that.cameras.length){
                        loop(sides, cameras)
                    }else{
                        if(si < sides.length -1){
                            si++;
                            ci = 0;

                            loop(sides, cameras);
                        }else{

                            console.log('end moving files'.green);
                            that.generateTimeJSON(function(){
                                callback();
                            })
                        }
                    }
                });
            }

            loop(this.sides, this.cameras);
        },

        start: function(side, camera, callback){
            var that = this;

            this.side = side;
            this.camera = camera;

            var pictures;
            var index = 0;

            var loop = function(pictures){

                that.rename(pictures[index], that.path+side+camera+'/', function(){
                    index++;
                    if(index < pictures.length){
                        loop(pictures);
                    }else{
                        callback();
                    }
                });
            }

            this.startResize(function(){
                pictures = that.readFiles();
                if(pictures.length > 0){
                    loop(pictures);
                }else{
                    callback();
                }
            });

        },

        readFiles: function(){

            var pictures = [];
            //
            var folder = this.path+this.side+this.camera+'/';
            //resize picture of this folder
            if(fs.existsSync(folder)){
                pictures = fs.readdirSync(folder);

                pictures.sort(function(a, b) {
                    return a < b ? -1 : 1;
                })
            }


            return pictures;

        },

        startResize: function(callback){
            var that = this;
            var pictures = that.readFiles();
            var index = 0;
            console.log('start resize'.cyan);

            var loop = function(pictures){
                var bigPic = that.bigPicDuplication(pictures[index]);
                bigPic.then(function(){
                    that.resize(pictures[index], function(){
                        index++;
                        if(index < pictures.length){
                            loop(pictures);
                        }else{
                            console.log('end resize'.green)
                            callback();
                        }
                    });
                }).done();
            }

            if(pictures.length > 0){
                loop(pictures);
            }else{
                callback();
            }
        },

        bigPicDuplication: function(picture){

            var defer = Q.defer();
            var folder = this.path+this.side+this.camera+'/';
            var pic = gm(folder+picture);
            var that = this;

            pic.size(function(err, size){
                //1024px wide pics are copied into merge1024 folder.
                if(size.width == size.height && size.width == 1024){
                    that.saveBigPicture(picture).then(function(){
                        defer.resolve();
                    }).done();
                }else{
                    //Remove the pic from the DB pictures_big
                    var tempName = picture.split('/');
                    tempName = tempName[tempName.length -1];
                    connection('pictures_big').where('temp_name', tempName).del().then(function(){
                        console.log('removed from pictures_big : '+tempName);
                        defer.resolve();
                    }).done();
                }
            });

            return defer.promise;
        },

        saveBigPicture: function(picture) {
            var folder = this.path+this.side+this.camera+'/';
            this._picNumberBig++;
            var name = this.pad(String(this._picNumberBig), 5);
            fs.copySync(folder+picture, 'exports/merge_big/'+name+".jpg");
            return connection('pictures_big').where('temp_name', picture).update({'name': name+'.jpg'});
        },

        resize: function(picture, callback){
            var folder = this.path+this.side+this.camera+'/';
            var pic = gm(folder+picture);
            var that = this;
            pic.size(function(err, size){

                if(err){console.log(err)};
                //Every square pic with a width > 255 are resized into merge
                if(size.width == size.height && size.width > 255){
                    pic.resize(256, 256)
                    .write(folder+picture, function (err) {
                        if (err){console.log(err);}
                        callback();
                    });
                }else{
                    fs.unlinkSync(folder+picture);
                    //Remove the pic from the DB
                    var tempName = picture.split('/');
                    tempName = tempName[tempName.length -1];
                    connection('pictures').where('temp_name', tempName).del().then(function(){
                        console.log('removed : '+tempName);
                        callback();
                    }).done();
                    
                }
            });
        },

        rename: function(pic, folder, callback){
            var that = this;
            that._picNumber++;
            var name = that.pad(String(that._picNumber), 5);
            fs.renameSync(folder+pic, that.path+'merge/'+name+".jpg");

            that.saveNewName(pic, name, callback);
        },

        pad: function(str, max){
            return str.length < max ? this.pad("0" + str, max) : str;
        },

        saveNewName: function(pic, name, callback){
            connection('pictures').where('temp_name', pic).update({'name': name+'.jpg'}).then(function(){
                callback();
            });
        },

        generateTimeJSON: function(callback){
            var that = this;
            console.log('begin of sols.json generation'.cyan);

            Q.all([
                that._generateJSON(),
                that._generateBigJSON()
            ]).then(function(){
                callback();
            }).done();

        },

        _generateJSON: function(){
            var that = this;
            var defer = Q.defer();
            connection('pictures').select('sol', connection.raw('count(id) as total')).groupBy('sol').orderBy('sol', 'ASC').then(function(rows){

                var temp = 0.0;
                var time = {};
                for (k in rows){
                    var row = rows[k];
                    temp += row.total;
                    time[row.sol] = temp / 10;
                }
                
                fs.writeFileSync(that.path+'sols.json', JSON.stringify(time));
                console.log('sols.json generated'.green);

                defer.resolve();


            }).done();

            return defer.promise;
        },

        _generateBigJSON: function(){
            var that = this;
            var defer = Q.defer();
            connection('pictures_big').select('sol', connection.raw('count(id) as total')).groupBy('sol').orderBy('sol', 'ASC').then(function(rows){

                var temp = 0.0;
                var time = {};
                for (k in rows){
                    var row = rows[k];
                    temp += row.total;
                    time[row.sol] = temp / 10;
                }
                
                fs.writeFileSync(that.path+'sols_big.json', JSON.stringify(time));
                console.log('sols_big.json generated'.green);

                defer.resolve();


            }).done();

            return defer.promise;
        }
    };

};
