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
         * 
         */
        //compiled version
        exec("~/bin/ffmpeg -r 10 -y -i "+sources+" -vcodec libx264 -preset slow -crf 24 -pix_fmt yuv420p "+destMP4+"", function(error, stdout, stderr){
            console.log('MP4 video encoded'.green);

            if (error !== null) {
                console.log('exec error: '.red + error);
            }

            //ubuntu version
            exec("/usr/bin/ffmpeg -r 10 -y -i "+sources+" -qscale 15 "+destOGG, function(error, stdout, stderr){
                console.log('OGG video encoded'.green);

                if (error !== null) {
                    console.log('exec error: '.red + error);
                }
            });
        });
    }
};
//ubuntu version (installed wit apt-get)
//  /usr/bin/ffmpeg -r 10 -y  -i ./exports/merge/%05d.jpg -qscale 1 ./exports/video.mp4
//  /usr/bin/ffmpeg -r 10 -y  -i ./exports/merge/%05d.jpg -qscale 15 ./exports/video.ogg

//compiled version (https://trac.ffmpeg.org/wiki/UbuntuCompilationGuide)
// ~/bin/ffmpeg -r 10 -y -i ./exports/merge/%05d.jpg ./test.ogv
//~/bin/ffmpeg -r 10 -y -i ./exports/merge/%05d.jpg -vcodec libx264 -preset slow -crf 24 -pix_fmt yuv420p ./test.mp4
