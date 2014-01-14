<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Curiosity's Trip</title>
    <!-- <meta name="viewport" content="width=device-width, user-scalable=no"> -->
    <link rel="stylesheet" type="text/css" href="public/css/main.css" media="all" />
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css' />
    <link rel="image_src" href="http://projects.spope.fr/curiosity/exports/merge/00001.jpg" />
    <meta property="og:image" content="http://projects.spope.fr/curiosity/exports/merge/00001.jpg"/>
</head>
<body>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div id="global">
    <div id="main">
        <header>
            <h1>Curiosity's trip</h1>
            <h2>Daily updated</h2>
            <div class="clr"></div>
        </header>

        <section>

            <h3>About</h3>
            <p>Welcome to Curiosity's Trip. It's a script aimed at retrieving Curiosity's pictures (available on <a href="http://mars.jpl.nasa.gov/msl/multimedia/raw/" title="Curiosity's raw pictures" target="_blank">JPL's website</a>) to create a video of its trip.</p>
            <p>It download pictures from <strong>Front Hazard Avoidance Cameras</strong> (Front Hazcams). I have chosen this camera because it look in front of the rover and it won't rotate or move. The script check either <strong>A and B side</strong> cameras. A-side which is linked to main computer had worked until February when a memory glitch corrupted main computer, so backup or B-side computer has been switched on to replace A-side during its debugging. So from Sol 215 to now, pictures are taken with B-side.</p>
            <p>Hazcams have a resolution of 1024X1024 but not every pictures are 1024px wide. The other formats are 256px, 64px and sometimes, custom sizes <a href="http://mars.jpl.nasa.gov/msl/multimedia/raw/?s=474&camera=FHAZ_" target="_blank" title="JPL - MSL raw images">are requested</a>.</p>

        </section>

        <section>

            <h3>Videos</h3>

            <p>In the first video, 1024px pictures are downscaled to 256px to increase the amount of pictures. Video become <strong>smoother at sol 360</strong>.</p>

            <div id="centerVideo">
                <div id="divVideo">
                    <h3>Video</h3>
                    <video id="videoSmall" controls width="256" height="256" preload="auto">
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
            </div>
            
            <div class="clr"></div>

        <section>
            <hr />
            <br />
            <p>The second video, is made with <strong>1024px pictures only</strong>. It's shorter than the first because 1024px pictures are rarer.</p>

            <div id="divVideoBig">
                <video id="videoBig" controls width="1024" height="1024" preload="auto">
                    <source src="exports/video_big.mp4" type="video/mp4">
                    <source src="exports/video_big.ogg" type="video/ogg">
                    Curiosity's trip into video.
                </video>
            </div>
            

            <p>The video is composed of <?php echo count(glob('exports/merge_big/*.jpg')); ?> pictures and played at 10fps. The last parsed sol is <?php $sols = json_decode(file_get_contents('exports/sols.json'), true); end($sols); echo(key($sols)); ?></p>
        </section>

        <section>
            <hr />
            <p>If you have any questions, feel free to  <a href="https://twitter.com/spopila" target="_blank" title="Contact me on tiwtter">contact me on Twitter</a>, for bugs or improvements, <a href="https://github.com/Spope/curiosity/issues" title="Issue on Github" target="_blank">open an issue on Github</a>.</p>
        </section>

        <hr />

        <div id="share">
            <h3>Share</h3>
            <div class="fll">
                <!-- Place this tag where you want the +1 button to render. -->
                <div class="g-plusone" data-size="medium"></div>

                <!-- Place this tag after the last +1 button tag. -->
                <script type="text/javascript">
                  (function() {
                    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
                    po.src = 'https://apis.google.com/js/platform.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
                  })();
                </script>
            </div>

            <div class="fll">
                <a href="https://twitter.com/share" class="twitter-share-button" data-via="spopila">Tweet</a>
        <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
            </div>

            <div class="fll">
                <div class="fb-share-button" data-href="http://projects.spope.fr/curiosity" data-type="button_count"></div>
            </div>
            
            <div class="clr"></div>
            <p>Or you can embed the video and the sols with this tag : <a id="previewEmbed">(preview)</a><img id="imgPreview" src="public/img/embed.png" width="512" height="256" alt="Preview of the embeded iframe" /></p>
            <textarea readonly="readonly" onclick="this.select()"><iframe src="http://projects.spope.fr/curiosity/share.php" width="512" height="256" frameborder="0" ></iframe></textarea>
        </div>
    </div>
</div>
<a href="https://github.com/Spope/curiosity"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
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
<script type="text/javascript" src="public/js/rollOver.js"></script>
<script type="text/javascript" src="public/js/sols.js"></script>
<script type="text/javascript">
var sol =  new DynamicSol('videoSmall', 'sol', 'sols.json');
sol.init();
</script>
<?php
}
?>
</body>
</html>
