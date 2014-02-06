var util = require('util')
var exec = require('child_process').exec;
var Q  = require('q');


module.exports = {

    convert: function(){

        var that        = this;
        var sources     = './exports/merge/%05d.jpg';
        var sources_big = './exports/merge_big/%05d.jpg';
        var destMP4     = './exports/video.mp4';
        var destMP4_big = './exports/video_big.mp4';
        var destOGG     = './exports/video.webm';
        var destOGG_big = './exports/video_big.webm';

        console.log('start video encoding'.cyan);
        that.doMP4(sources, destMP4).then(function(){
            return that.doOGG(sources, destOGG, "1M");
        }).then(function(){
            return that.doMP4(sources_big, destMP4_big);
        }).then(function(){
            return that.doOGG(sources_big, destOGG_big, "2M");
        }).done();
    },

    doMP4: function(sources, dest){
        var defer = Q.defer();
        //compiled version
        exec("ffmpeg -r 10 -y -i "+sources+" -vcodec libx264 -preset slow -crf 24 -pix_fmt yuv420p "+dest+"", function(error, stdout, stderr){
            console.log('MP4 video encoded'.green+" "+dest);
            if (error !== null) {
                console.log('exec error: '.red + error);
                defer.reject();
            }

            defer.resolve();
        });

        return defer.promise;

    },

    doOGG: function(sources, dest, bitrate){
        var defer = Q.defer();
        //ubuntu version
        exec("ffmpeg -r 10 -y -i "+sources+" -c:v libvpx -b:v "+bitrate+" -c:a libvorbis "+dest, function(error, stdout, stderr){
            console.log('webM video encoded'.green+" "+dest);
            if (error !== null) {
                console.log('exec error: '.red + error);
                defer.reject();
            }

            defer.resolve();
        });

        return defer.promise;

    }
};


//ubuntu version (installed wit apt-get)
//  /usr/bin/ffmpeg -r 10 -y  -i ./exports/merge/%05d.jpg -qscale 1 ./exports/video.mp4
//  /usr/bin/ffmpeg -r 10 -y  -i ./exports/merge/%05d.jpg -qscale 15 ./exports/video.ogg

//compiled version (https://trac.ffmpeg.org/wiki/UbuntuCompilationGuide)
// ~/bin/ffmpeg -r 10 -y -i ./exports/merge/%05d.jpg ./test.ogv
//~/bin/ffmpeg -r 10 -y -i ./exports/merge/%05d.jpg -vcodec libx264 -preset slow -crf 24 -pix_fmt yuv420p ./test.mp4
