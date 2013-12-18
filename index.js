var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');


var url = 'http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=93&camera=FHAZ_'; //12
//var url = 'http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=21&camera=FHAZ_'; //2

request({ 'uri' : url }, function (err, response, body){

    if (err || response.statusCode != 200) {
        console.log('Bad response');
        return;
    }

    var answer = parseD(body);
});


var parse = function(html){
    var alt = 'Image taken by Front Hazcam: Right A';
    var $ = cheerio.load(html);

    console.log("DL ok");
    var list = $('body').find('img[alt="'+alt+'"]').toArray();
    //
    for(var i in list){
        if(list[i].attribs && list[i].attribs.src){
            //console.log($(list[i]).parent());
            var src = (list[i].attribs.src).replace('-thm.jpg', '.JPG');
            console.log(src);
            saveImg(src, i+".jpg");
        }
    }
};


var parseD = function(html){
    var $ = cheerio.load(html);
    var content = "Front Hazcam: Right A";

    console.log("DL ok");
    var list = $('body').find("table:contains('FULL')  div.RawImageCaption:contains('"+content+"')").toArray();
    //
    for(var i in list){
        var href = $(list[i]).find("a")[0].attribs.href;
        saveImg(href, i+".jpg");
    }

}


var saveImg = function(url, filename){

    request.head(url, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(url).pipe(fs.createWriteStream("export/"+filename));
    });
}
