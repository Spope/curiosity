var previewEmbed = function(){
    this.btn = document.getElementById('previewEmbed');
    this.preview = document.getElementById('imgPreview');

    this.btn.onmouseover = function(e) {
        this.preview.style.display = "block";
        //this.bindMove();
    }.bind(this);

    this.btn.onmouseout = function(e) {
        this.preview.style.display = "none";
        this.unbindMove();
    }.bind(this);

    this.bindMove = function() {
        window.onmousemove = function(e) {
            var top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
            top -= 266;
            this.preview.style.top = (e.clientY+top)+"px";
            this.preview.style.left = e.clientX+10+"px";
        }.bind(this);
    }

    this.unbindMove = function() {
        window.onmousemove = null;
    }
}

new previewEmbed();
