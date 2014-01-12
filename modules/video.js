var util = require('util')
var exec = require('child_process').exec;


module.exports = {

    convert: function(){

        var sources = './exports/merge/%05d.jpg';
        var destMP4 = './exports/video.mp4';
        var destOGG = './exports/video.ogg';

        console.log('start video encoding'.cyan);
        /*
         * -i input name
         * -r framerate
         * -y overwrite
         * -qscale 1 > max quality
         */
        //exec("ffmpeg -r 10 -y -qscale 1 -i "+sources+" "+destMP4, function(error, stdout, stderr){
        exec("~/bin/ffmpeg -r 10 -y -i "+sources+" -vcodec libx264 -preset slow -crf 24 -pix_fmt yuv420p "+destMP4+"", function(error, stdout, stderr){
            console.log('MP4 video encoded'.green);

            if (error !== null) {
                console.log('exec error: '.red + error);
            }

            //exec("ffmpeg -r 10 -y -qscale 15 -i "+sources+" "+destOGG, function(error, stdout, stderr){
            exec("~/bin/ffmpeg -r 10 -y -i "+sources+" "+destOGG, function(error, stdout, stderr){
                console.log('OGG video encoded'.green);

                if (error !== null) {
                    console.log('exec error: '.red + error);
                }
            });
        });
    }
};
//  /usr/bin/ffmpeg -r 10 -y  -i ./exports/merge/%05d.jpg -qscale 1 ./exports/video.mp4
//  /usr/bin/ffmpeg -r 10 -y  -i ./exports/merge/%05d.jpg -qscale 15 ./exports/video.ogg
