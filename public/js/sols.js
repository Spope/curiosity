var DynamicSol = function(video, display, url){
    this.sols     = null;
    this.sols_url = url;
    this.video    = document.getElementById(video);
    this.display  = document.getElementById(display);

    this.init = function(){
        var _this = this;

        this.xhr({
            url: 'exports/'+this.sols_url,
            callback: function(data){
                _this.sols = JSON.parse(data);
                _this.startListen();
            }
        });
    };

    this.startListen = function(){
        this.video.addEventListener('timeupdate', function(e){
            this.updateSol();
        }.bind(this), false);
    };

    this.updateSol = function(e){
        var sol = this.getSol(this.video.currentTime);
        this.display.innerHTML = sol;
    };

    this.getSol = function(t){
        for(k in this.sols){
            var sT = this.sols[k];
            if(sT > t){
                return k;
            }
        }
    };

    this.xhr = function(options){

        var _this = this;

        options.body = options.body || '';
        options.method = options.method || 'GET';
        options.requestHeader = options.requestHeader || 'application/json';
        if(!options.url)throw Error('XHR need a URL');

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(event) {
            if (xhr.readyState == 4) {

                if(xhr.status == 200) {
                    if(options.callback){
                        options.callback(xhr.responseText);
                    }
                    return;
                } else {
                    document.querySelector('#error').innerHTML = options.error ||'Error on xhr';
                    _this.viewManager.set('error');
                }
            }
        };
        xhr.open(options.method, options.url, true);
        xhr.setRequestHeader('Content-Type', options.requestHeader);
        xhr.send(options.body);
    };
};


