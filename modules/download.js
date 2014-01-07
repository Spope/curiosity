var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');
var Q       = require('q');
var moment  = require('moment');

module.exports = function(connection){

    return {
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

        loadPics: function(callback){
            var si = 0;
            var ci = 0;
            var that = this;

            //Loop on each cameras / sides
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

            this.getPreviousParsedSol().then(function(lastParsedSol){
                that.previousSol = lastParsedSol[0].sol;
                return that.getAddresses();

            }).then(function(){
                loop(that.sides, that.cameras);
            }).done();

            //this.getAddresses().then(function(){
                //loop(that.sides, that.cameras);
            //});
        },

        getPreviousParsedSol: function(){
            return connection('pictures').select('sol').orderBy('sol', 'desc').limit('1');
        },

        getAddresses: function(){
            var defer = Q.defer();
            var that = this;
            //this.previousSol = fs.readFileSync(this.path+'last-sol.txt');

            console.log('Requesting'.cyan+' : listing');
            request({ 'uri' : this.listingUrl }, function (err, response, body){

                if (err || response.statusCode != 200) {
                    console.log('Bad response on listing URL'.red);
                    return;
                }

                console.log('Received'.green+' : listing')
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
                    //var url = list[i].attribs.href;
                    //url = url.replace('./', 'http://mars.jpl.nasa.gov/msl/multimedia/raw/');
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
                        that._urls.push(parseInt(sol));
                    }
                }
                defer.resolve();
            });

            return defer.promise;
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
            }).done();
        },

        nextPage: function(){
            var that = this;
            if(this._index < this._urls.length){
                var sol = this._urls[this._index];
                this.loadPage(sol, function(body){
                    var list = that.parse(body, sol);
                    that.download(list, function(){that.nextPage();});
                });
                this._index++;
            }else{
                console.log('Scrapping pic ended');
                //fs.writeFileSync(that.path+'last-sol.txt', this.currentLastSol);
                //console.log('Sol saved!');
                this._end.resolve();
            }
        },

        //Get the html of pictures listing page
        loadPage: function(sol, callback){
            var url = 'http://mars.jpl.nasa.gov/msl/multimedia/raw/?s='+sol+'&camera=FHAZ_'
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

        //Retrieve url listing of pictures
        parse: function(html, sol){
            var that = this;
            var alt = 'Image taken by Front Hazcam: '+this.side+' '+this.camera;
            var $ = cheerio.load(html);

            var list = $('body').find('img[alt="'+alt+'"][width="160"]').toArray();
            var pics = [];
            for(var i in list){
                if(list[i].attribs && list[i].attribs.src){
                    var src = (list[i].attribs.src).replace('-thm.jpg', '.JPG');
                    var split = src.split('/');
                    var originalName = split[split.length-1];
                    var el = $(list[i]).parent().next().next().find('.RawImageUTC');
                    el.children().remove();

                    var picDate =  el.text();
                    picDate = picDate.replace(' UTC', '');

                    var name = picDate.replace(/\s/g, '-');
                    name = name.replace(/:/g, '-');
                    pics.push({
                        originalName : originalName,
                        name         : name,
                        src          : src,
                        sol          : sol,
                        date         : moment.utc(picDate).format("YYYY-MM-DD HH:mm:ss")
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
            var promises = [];
            for(var i in list){
                console.log(list[i].name);
                var promise = this.saveImg(list[i], list[i].name+".jpg");
                promises.push(promise);
            }

            Q.all(promises).then(function(){
                console.log('Pics loaded'.green);
                callback();
            }).done();

        },

        saveImg: function(pic, filename){
            var that = this;
            var defer = Q.defer();

            var writer = fs.createWriteStream(that.path+that.side+that.camera+"/"+filename);
            var dl = request(pic.src)
                .on('end', function(){
                    that.savePicture(pic).then(function(){
                        defer.resolve(true);
                    }, function(){
                        defer.reject();
                    }).done();
                })
                .pipe(writer)
            ;

            return defer.promise;
        },

        savePicture: function(pic){
            var defer = Q.defer();
            var query = connection('pictures').where('original_name', pic.originalName).select('id');
            query.then(function(row){

                if(row.length == 0) {

                    connection('pictures').insert({
                        original_name : pic.originalName,
                        name          : '',
                        temp_name     : pic.name+'.jpg',
                        date          : pic.date,
                        sol           : pic.sol
                    }).then(function(){
                        console.log('pic saved : '.green+' '+pic.originalName);
                        defer.resolve();

                    }, function(err){
                        console.log('Error on saving picture to database'.red);
                        console.log(err);
                        defer.reject();
                    }).done();
                }else{
                    if(typeof(callback) == 'function'){
                        callback();
                    }
                }
            }, function(err){
                console.log('The error'.red);
                console.log(err);
                defer.reject();
            }).done();

            return defer.promise;
        }
    };
}
