<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Curiosity's Trip</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="stylesheet" type="text/css" href="public/css/main.css" media="all" />
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css'>
</head>
<body>
<div id="global">
    <div id="main">
        <header>
            <h1>Curiosity's trip</h1>
        </header>

        <section>
            <h2>This page is a WIP</h2>

            <h3>About</h3>
            <p>Welcome to Curiosity's Trip. It's a script aimed at retrieving Curiosity's pictures (available on <a href="http://mars.jpl.nasa.gov/msl/multimedia/raw/" title="Curiosity's raw pictures" target="_blank">JPL's website</a>) to create a video of its trip.</p>
            <p>It download pictures from Front Hazard Avoidance Cameras (Front Hazcams). I have choosen this camera because it look in front of the rover and it won't rotate or move. The script check either A and B side cameras. A-side which is linked to main computer had worked until February when a memory glitch corrupted main computer, so backup or B-side computer has been switched on to replace A-side during its debugging. So from Sol 215 to now, pictures are taken with B-side.</p>
            <p>Hazcams have a resolution of 1024X1024 but only a small amount of pictures are 1024px wide. The other formats are 256px, 64px and sometimes, custom sizes <a href="http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=474&camera=FHAZ_" target="_blank" title="JPL - MSL raw images">are requested</a>. As 64px is a bit small they won't be downloaded and 1024px pictures are downscaled to 256px to increase the amount of pictures.</p>

        </section>

        <section>
            <div id="divVideo">
                <h3>Video</h3>
                <video controls width="256" height="256" preload="auto">
                    <source src="exports/video.mp4" type="video/mp4">
                    <source src="exports/video.ogg" type="video/ogg">
                    Curiosity's trip into video.
                </video>
            </div>

            <div id="currentSol">
                <h3>Sol</h3>
                <h3 id="sol">0</h3>
            </div>
            <div class="clr"></div>

            <p>The video is composed of <?php echo count(glob('exports/merge/*.jpg')); ?> pictures and played at 10fps. The last parsed sol is <?php $sols = json_decode(file_get_contents('exports/sols.json'), true); end($sols); echo(key($sols)); ?></p>
        </section>

        <section>
            <p>If you have any questions, feel free to  <a href="https://twitter.com/spopila" target="_blank" title="Contact me on tiwtter">contact me on Twitter</a>, for bugs or improvements, <a href="https://github.com/Spope/curiosity/issues" title="Issue on Github" target="_blank">open an issue on Github</a>.</p>
        </section>

        <a href="https://github.com/Spope/curiosity"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
    </div>
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
