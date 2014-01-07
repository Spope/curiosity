var DynamicSol = {
    sols: null,
    video: null,
    display: null,

    init: function(){
        var _this = this;
        this.video = document.getElementsByTagName('video')[0]
        this.display = document.getElementById('sol');

        this.xhr({
            url: "exports/sols.json",
            callback: function(data){
                _this.sols = JSON.parse(data);
                _this.startListen();
            }
        });
    },

    startListen: function(){
        this.video.addEventListener('timeupdate', function(e){
            this.updateSol();
        }.bind(this), false);
    },

    updateSol: function(e){
        var sol = this.getSol(this.video.currentTime);
        this.display.innerHTML = sol;
    },

    getSol: function(t){
        for(k in this.sols){
            var sT = this.sols[k];
            if(sT > t){
                return k;
            }
        }
    },

    xhr: function(options){

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
    }
};

DynamicSol.init();
