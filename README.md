**Currently under dev**

# Curiosity

Script to download picutres taken by Curiosity chronologically.

The script will load [http://mars.jpl.nasa.gov/msl/multimedia/raw/](http://mars.jpl.nasa.gov/msl/multimedia/raw/) to retrieve links into the section "Front Hazard Avoidance Cameras (Front Hazcams)". I have choosen this camera because it look in front of the rover and it won't rotate or move.

Then for each Sol, it will load the page and parse the pictures links. You can select which camera (A - B) and which side (Left - Right).

It will download pictures >= 256px width. Then it will remove non square pictures (somes are) and reduces them to 256X256px. After that, ffmpeg will create a .mp4 video at 10fps.

##Specification

####Server Side
* NodeJS
    * cheerio
    * request
    * q
    * gm
    * colors
* imagemagick
* graphicsmagick
* ffmpeg


##Installation

###Server
Go into **root/** and run

    npm install

	//If not installed
    sudo apt-get install imagemagick
	sudo apt-get install graphicsmagick

###Execution
	node index.js

It will save images into exports/{Left}{A}/{date}.jpg

Then they'll be merged and size into exports/merge/

Finally the video will be in exports/video.mp4