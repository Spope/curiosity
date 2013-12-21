var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');
var Q       = require('q');

module.exports = {

    sides: ['Left'],
    cameras: ['A', 'B'],
    side: null,
    camera: null,
    listingUrl: 'http://mars.jpl.nasa.gov/msl/multimedia/raw/',
    previousSol: 0,
    currentLastSol:0,
    path: 'exports/',

    _urls: [],
    _index: 0,
    
    _end: null,
    _loading: 0,
    
    loadPics: function(callback){
        var si = 0;
        var ci = 0;
        var that = this;

        var loop = function(sides, cameras){
            that.start(sides[si], cameras[ci], function(){
                ci++;
                that._index = 0;
                if(ci < cameras.length){
                    loop(sides, cameras)
                }else{
                    if(si < sides.length -1){
                        si++;
                        ci = 0;

                        loop(sides, cameras);
                    }else{
                        callback();
                    }
                }
            });
        }

        this.getAddresses().then(function(){
            loop(that.sides, that.cameras);
        });
    },

    start: function(side, camera, callback){
        this._end = Q.defer();
        this.side = side;
        this.camera = camera;
        console.log('start scrapping : '.cyan+side+camera);

        this.nextPage();

        this._end.promise.then(function(){
            console.log('next camera'.cyan);
            callback();
        });
    },

    getAddresses: function(){
        var defer = Q.defer();
        var that = this;
        this.previousSol = fs.readFileSync(this.path+'last-sol.txt');

        console.log('Requesting'.cyan+' : listing');
        request({ 'uri' : this.listingUrl }, function (err, response, body){

            if (err || response.statusCode != 200) {
                console.log('Bad response on listing URL'.red);
                return;
            }

            console.log('Reveived'.green+' : listing')
            //loading page into cheerio
            var $ = cheerio.load(body);
            //retrieving <a> list
            var list = $('body')
            .find('div.image_title:contains("Front Hazard Avoidance Cameras (Front Hazcams)")')
            .next()
            .children('.image_list')
            .children('ul')
            .children('li')
            .children('a')
            .toArray();

            var sol;
            for(var i in list){
                var url = list[i].attribs.href;
                url = url.replace('./', 'http://mars.jpl.nasa.gov/msl/multimedia/raw/');
                sol = $(list[i].children).text();
                sol = sol.split('\n');
                sol = sol[1];
                if(i == 0){
                    that.currentLastSol = sol;

                    //I look if I had already scraped this sol
                    if(that.previousSol == sol){
                        console.log('No new pictures'.green);
                        defer.resolve();

                        return true;
                    }
                }

                if(sol > that.previousSol){
                    that._urls.push(url);
                }
            }
            defer.resolve();
        });

        return defer.promise;
    },

    nextPage: function(){
        var that = this;
        if(this._index < this._urls.length){
            this.loadPage(this._urls[this._index], function(body){
                var list = that.parse(body);
                that.download(list, function(){that.nextPage();});
            });
            this._index++;
        }else{
            console.log('Scrapping pic ended');
            fs.writeFileSync(that.path+'last-sol.txt', this.currentLastSol);
            console.log('Sol saved!');
            this._end.resolve();
        }
    },

    loadPage: function(url, callback){
        var that = this;

        request({ 'uri' : url }, function (err, response, body){

            if (err || response.statusCode != 200) {
                console.log('Bad response'.red+' on page load');
                return;
            }

            console.log('Page loaded : '.green+' '+url);

            callback(body);
        });
    },

    parse: function(html){
        var that = this;
        var alt = 'Image taken by Front Hazcam: '+this.side+' '+this.camera;
        var $ = cheerio.load(html);

        var list = $('body').find('img[alt="'+alt+'"][width="160"]').toArray();
        var pics = [];
        for(var i in list){
            if(list[i].attribs && list[i].attribs.src){
                var src = (list[i].attribs.src).replace('-thm.jpg', '.JPG');
                var el = $(list[i]).parent().next().next().find('.RawImageUTC');
                el.children().remove();
                var picDate =  el.text();
                picDate = picDate.replace(' UTC', '');
                picDate = picDate.replace(/\s/g, '-');
                picDate = picDate.replace(/:/g, '-');
                pics.push({
                    name: picDate,
                    src: src
                });
            }
        }

        return pics;
    },

    download: function(list, callback){
        //
        var that = this;
        console.log('loading pics'.cyan);
        if(list.length == 0){
            callback();
            return;
        }
        for(var i in list){
            console.log(list[i].name);
            this._loading++;

            this.saveImg(list[i].src, list[i].name+".jpg").then(function(){
                that._loading--;
                if(that._loading == 0){
                    console.log('Pics loaded'.green);
                    callback();
                }
            }).done();
        }
    },

    saveImg: function(url, filename){
        var that = this;
        var defer = Q.defer();

        request.head(url, function(err, res, body){
            var writer = fs.createWriteStream(that.path+that.side+that.camera+"/"+filename);
            var dl = request(url)
                .on('end', function(){
                    defer.resolve(true);
                })
                .pipe(writer)
            ;
        });

        return defer.promise;
    }
}
