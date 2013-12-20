var fs = require('fs');
var gm = require('gm');
var Q  = require('q');

module.exports = {

    cameras: ['A', 'B'],
    side: ['Left', 'Right'],
    path: 'exports/',

    _end: Q.defer(),

    merge: function(){
        var that = this;
        this._readFiles().then(function(){
            console.log('start resize'.cyan);
            return that._resize();
        }).then(function(){
            that._end.resolve();

        }).catch(function(err){console.log(err)});;

        return this._end.promise;
    },

    _readFiles: function(){
        var defer = Q.defer();

        console.log('start moving files');
        var picLength = 0
        for(var i in this.side){
            for(var k in this.cameras){
                //foreach cameras / side
                var folder = this.path+this.side[i]+this.cameras[k]+'/';
                if(fs.existsSync(folder)){
                    var pictures = fs.readdirSync(folder);
                    picLength += pictures.length;
                    for(var index in pictures){
                        //
                        this._rename(pictures[index], folder).then(function(){
                            picLength--;
                            if(picLength == 0){
                                console.log('moving pics ends'.green);
                                defer.resolve();
                            }
                        });
                    }
                }
            }
        }

        return defer.promise;
    },

    _rename: function(pic, folder){
        var defer = Q.defer();

        var that = this;
        gm(folder+pic).size(function (err, size) {
            if (!err){
                //Check if the picture is correct
                if(size.width == size.height && size.width > 255){
                    fs.renameSync(folder+pic, that.path+'merge/'+pic);
                }
                defer.resolve();
            }else{
                console.log(err);
                defer.reject();
            }
        });

        return defer.promise;
    },

    _resize: function(){
        var pictures = fs.readdirSync(this.path+"merge/");
        for(var i in pictures){
            gm(this.path+"merge/"+pictures[i])
                .resize(256, 256)
                .write(this.path+"merge/"+pictures[i], function (err) {
                    if (err){console.log(err);} 
                });
        }
    }

};
