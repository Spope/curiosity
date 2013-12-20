var fs = require('fs');
var gm = require('gm');
var Q  = require('q');

module.exports = {

    cameras: ['A', 'B'],
    sides: ['Left', 'Right'],
    camera: null,
    side: null,
    path: 'exports/',

    _picNumber: 0,

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
                        that._startResize(function(){
                            console.log('end resize'.green)
                            callback();
                        });
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

        var pictures = this._readFiles();
        var index = 0;

        
        var loop = function(pictures){
            
            that._rename(pictures[index], that.path+side+camera+'/', function(){
                index++;
                if(index < pictures.length){
                    loop(pictures);
                }else{
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

    _readFiles: function(){

        var pictures = [];
        //
        var folder = this.path+this.side+this.camera+'/';
        if(fs.existsSync(folder)){
            pictures = fs.readdirSync(folder);
        }

        return pictures;

    },

    _rename: function(pic, folder, callback){
        var that = this;
        gm(folder+pic).size(function (err, size) {
            
            if (!err){
                //Check if the picture is correct
                if(size.width == size.height && size.width > 255){
                    that._picNumber++;
                    var name = that.pad(String(that._picNumber), 5)
                    fs.renameSync(folder+pic, that.path+'merge/'+name+".jpg");
                }

                callback();
            }else{
                console.log(err);
            }
        });

    },

    pad: function(str, max){
        return str.length < max ? this.pad("0" + str, max) : str;
    },

    _startResize: function(callback){
        var that = this;
        var pictures = fs.readdirSync(this.path+"merge/");
        var index = 0;
        console.log('start resize'.cyan);

        var loop = function(pictures){
            that._resize(that.path+'merge/'+pictures[index], function(){
                index++;
                if(index < pictures.length){
                    loop(pictures);
                }else{
                    callback();
                }
            });
        }

        loop(pictures);
    },

    _resize: function(picture, callback){

        gm(picture)
            .resize(256, 256)
            .write(picture, function (err) {
                if (err){console.log(err);}
                callback();
            });
    }

};
