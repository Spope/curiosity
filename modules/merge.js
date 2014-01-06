var fs = require('fs');
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

                            console.log('end moving files'.green)
                            callback();
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
            var folder = this.path+this.side+this.camera+'/';
            var pictures = that.readFiles();
            var index = 0;
            console.log('start resize'.cyan);

            var loop = function(pictures){
                that.resize(folder+pictures[index], function(){
                    index++;
                    if(index < pictures.length){
                        loop(pictures);
                    }else{
                        console.log('end resize'.green)
                        callback();
                    }
                });
            }

            if(pictures.length > 0){
                loop(pictures);
            }else{
                callback();
            }
        },

        resize: function(picture, callback){

            var pic = gm(picture);

            pic.size(function(err, size){

                if(err){console.log(err)};
                if(size.width == size.height && size.width > 255){
                    pic.resize(256, 256)
                    .write(picture, function (err) {
                        if (err){console.log(err);}
                        callback();
                    });
                }else{
                    fs.unlinkSync(picture);
                    callback();
                }
            });
        },

        rename: function(pic, folder, callback){
            var that = this;
            that._picNumber++;
            var name = that.pad(String(that._picNumber), 5);
            fs.renameSync(folder+pic, that.path+'merge/'+name+".jpg");

            this.saveNewName(pic, name, callback);
        },

        pad: function(str, max){
            return str.length < max ? this.pad("0" + str, max) : str;
        },

        saveNewName: function(pic, name, callback){
            connection('pictures')
            .where('temp_name', pic)
            .update({'name': name+'.jpg'})
            .then(function(){
                callback();
            });
        }
    };

};
