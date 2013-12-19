var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');
var Q       = require('q');


var urls = new Array();
var index = 0;


var position = "Right";
var camera   = "B";


var loadAdresses = function(){
    var url = 'http://mars.jpl.nasa.gov/msl/multimedia/raw/';
    request({ 'uri' : url }, function (err, response, body){

        if (err || response.statusCode != 200) {
            console.log('Bad response');
            return;
        }

        var $ = cheerio.load(body);
        var list = $('body').find('div.image_title:contains("Front Hazard Avoidance Cameras (Front Hazcams)")').next().children('.image_list').children('ul').children('li').children('a').toArray();

        for(var i in list){
            var url = list[i].attribs.href;
            url = url.replace('./', 'http://mars.jpl.nasa.gov/msl/multimedia/raw/');
            urls.push(url);
        }
        nextPage();
    });
}

loadAdresses();


var nextPage = function(){
    if(index < urls.length){
        loadPage(urls[index]);
    }
    index++;
}



var loadPage = function(url){
    //var url = 'http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=21&camera=FHAZ_'; //2

    request({ 'uri' : url }, function (err, response, body){

        if (err || response.statusCode != 200) {
            console.log('Bad response');
            return;
        }

        console.log("Page loaded. - "+url);
        var answer = parse(body);
    });
}

var parse = function(html){
    var alt = 'Image taken by Front Hazcam: '+position+' '+camera;
    var $ = cheerio.load(html);

    
    var list = $('body').find('img[alt="'+alt+'"][width="160"]').toArray();
    var loading = 0;
    if(list.length == 0){
        nextPage();

        return;
    }
    //
    for(var i in list){
        if(list[i].attribs && list[i].attribs.src){
            //
            var src = (list[i].attribs.src).replace('-thm.jpg', '.JPG');
            var el = $(list[i]).parent().next().next().find('.RawImageUTC');
            el.children().remove();
            var picDate =  el.text();
            picDate = picDate.replace(' UTC', '');
            picDate = picDate.replace(/\s/g, '-');
            picDate = picDate.replace(/:/g, '-');
            console.log(picDate);
            loading++;
            saveImg(src, picDate+".jpg").then(function(){

                loading--;
                if(loading == 0){
                    console.log('Pics loaded');
                    nextPage();
                }
            });
        }
    }
};




var saveImg = function(url, filename){

    var defer = Q.defer();

    request.head(url, function(err, res, body){

        var writer = fs.createWriteStream("exports/"+position+camera+"/"+filename);

        var dl = request(url)
            .on('end', function(){
                defer.resolve(true);
            })
            .pipe(writer)
        ;
    });

    return defer.promise;
}
