var previewEmbed = function(){
    this.btn = document.getElementById('previewEmbed');
    this.preview = document.getElementById('imgPreview');

    this.btn.onmouseover = function(e) {
        this.preview.style.display = "block";
    }.bind(this);

    this.btn.onmouseout = function(e) {
        this.preview.style.display = "none";
    }.bind(this);

}

new previewEmbed();
