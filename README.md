# Curiosity

Script to download picutres taken by Curiosity chronologically.

The script will load [http://mars.jpl.nasa.gov/msl/multimedia/raw/](http://mars.jpl.nasa.gov/msl/multimedia/raw/) to retrieve links into the section **"Front Hazard Avoidance Cameras (Front Hazcams)"**. I have choosen this camera because it look in front of the rover and it won't rotate or move.

Then for each Sol, it will load the page and parse the pictures links. You can select which camera (A - B) and which side (Left - Right).

It will avoid downloading thumbnails. Then it will remove non square pictures (somes are) and reduces them to 256X256px to increase pictures number (only a few are 1024px wide). After that, ffmpeg will create an .mp4 and .ogg videos at 10fps.

Each downloaded picture will be saved into a MySQL database. It allow to scrap new sols only when executing the app.

##Specification

####Server Side
* NodeJS
    * cheerio
    * request
    * q
    * gm
    * colors
    * mocha
    * grunt
    * moment
    * knex
* imagemagick
* ffmpeg
* mysql


##Installation

###Server
Go into **root/** and run

    npm install

	//If not installed
    sudo apt-get install imagemagick
    sudo apt-get install ffmpeg

The database schema is located in **config/db.sql**

###Execution
	node app.js

It will save images into **exports/{Left}{A}/{date}.jpg**

Then they'll be merged, named (00001.jpg) and sized (256X256px) into **exports/merge/**

Finally the video will be in **exports/video.mp4** and **exports/video.ogg**

###Tests

Tests can be run with grunt

	grunt default
