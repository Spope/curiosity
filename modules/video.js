var util = require('util')
var exec = require('child_process').exec;


module.exports = {

    convert: function(){

        function puts(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        }

        var sources = './exports/merge/%05d.jpg';
        var dest    = './exports/video.mp4';

        console.log('start video encoding'.cyan);
        exec("ffmpeg -r 10 -qscale 1 -i "+sources+" "+dest, puts);

    }
};