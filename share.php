<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Curiosity's Trip</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="stylesheet" type="text/css" href="public/css/iframe.css" media="all" />
</head>
<body>
<div id="global">
    <section class="clr">
        <div id="divVideo">
            <video controls width="256" height="256" preload="auto">
                <source src="exports/video.mp4" type="video/mp4">
                <source src="exports/video.ogg" type="video/ogg">
                Curiosity's trip into video.
            </video>
        </div>

        <div id="currentSol">
            <h2>Sol</h2>
            <h2 id="sol">0</h2>
            <p>The video is composed of 1<?php echo count(glob('exports/merge/*.jpg')); ?> pictures, from sol 0 to <?php $sols = json_decode(file_get_contents('exports/sols.json'), true); end($sols); echo(key($sols)); ?>.</p>
            <p id="source">Source : <a href="http://projects.spope.fr/curiosity/" target="_blank" title="Curiosity's Trip">Curiosity's Trip</a></p>
        </div>
        <div class="clr"></div>
    </section>

</div>
<?php
if($_SERVER['HTTP_HOST'] != "localhost" && $_SERVER['HTTP_HOST'] != "devserver2"){
?>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46723031-1', 'spope.fr');
  ga('send', 'pageview');
</script>
<script type="text/javascript" src="public/js/sols.js"></script>
<?php
}
?>
</body>
</html>
