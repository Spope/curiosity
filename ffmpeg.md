# FFMPEG Dependencies
sudo apt-get update
sudo apt-get -y install autoconf automake build-essential git libass-dev libgpac-dev \
 libsdl1.2-dev libtheora-dev libtool libva-dev libvdpau-dev libvorbis-dev libx11-dev \
 libxext-dev libxfixes-dev pkg-config texi2html zlib1g-dev libmp3lame-dev yasm libopus-dev

mkdir ~/ffmpeg_sources

# Install xh264
cd ~/ffmpeg_sources
git clone --depth 1 git://git.videolan.org/x264.git
cd x264
./configure --prefix="$HOME/ffmpeg_build" --bindir="$HOME/bin" --enable-static --disable-asm
make
make install
make distclean

# Install FFMPEG
cd ~/ffmpeg_sources
git clone --depth 1 git://source.ffmpeg.org/ffmpeg
cd ffmpeg
PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig"
export PKG_CONFIG_PATH
./configure --prefix="$HOME/ffmpeg_build" \
   --extra-cflags="-I$HOME/ffmpeg_build/include" --extra-ldflags="-L$HOME/ffmpeg_build/lib" \
   --bindir="$HOME/bin" --extra-libs="-ldl" --enable-gpl --enable-libass \
   --enable-libmp3lame --enable-libtheora --enable-libvorbis \
   --enable-libx264 --enable-nonfree --enable-x11grab
make
make install
make distclean
hash -r
. ~/.profile
