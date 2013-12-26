<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<div id="global">
    <div id="main">
        <header>
            <h1>Curiosity's trip</h1>
        </header>

        <section>
            <h2>This page is a WIP.</h2>
            <p>Welcome to Curiosity's Trip.</p>
            <p>This script is aimed to retrieve Curiosity's pictures (available on <a href="http://mars.jpl.nasa.gov/msl/multimedia/raw/" title="Curiosity's raw pictures" target="_blank">JPL's website</a>) to create a video of its trip.</p>
            <p>It download pictures from Front Hazard Avoidance Cameras (Front Hazcams). I have choosen this camera because it look in front of the rover and it won't rotate or move. The script check either A and B side cameras. A-side which is linked to main computer had worked until February when a memory glitch corrupted main computer, so backup or B-side computer has been switched on to replace A-side during its debugging. So from Sol 215 to now, pictures are taken with B-side.</p>
            <p>Hazcams have a resolution of 1024X1024 but only a small amount of pictures are 1024px wide, other formats are 256px and 64px. As 64px is a bit small, 1024px are downscaled to 256px.</p>
            <video src="exports/video.ogg" controls width="256" height="256" preload="auto">
                Curiosity's trip into video.
            </video>
        </section>

        <section>
        <p>The video is composed of <?php echo count(glob('exports/merge/*.jpg')); ?> pictures and play at 10fps</p>
        </section>

        <a href="https://github.com/Spope/curiosity"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
    </div>
</div>
</body>
</html>
