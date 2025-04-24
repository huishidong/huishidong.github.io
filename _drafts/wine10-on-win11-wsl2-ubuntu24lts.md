---
title:  "Run Old Windows Games on Win11 WSL2"
excerpt: "Run H3MM HD using wine"
date:   2025-02-17 21:42:39 -0600
categories: system
last_modified_at: 2025-02-18 14:42:39 -0600
taxonomy: wine
tags: wine ubuntu wsl wsl2 win11 h3mm
page_css:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
line_numbers: true
---

Some games are too old to be installed on windows directly, either it requires cd drive, or it is not supported by the new windows not even the compatible mode. `Wine` under linux is the rescue. You can run linux using WSL/WSL2 under windows. Here is how.

NOTE: if after any change (ie. install i386 architect) wine failed to start, just remove `$HOME/.wine` and run `winecfg` from scratch to get the updated setup.

# Install `Wine` and Upgrade to `Wine` 10

`Wine` 9 is shipped with Ubuntu 24.04 LTS, and it would crash when running games
```bash
(base) huishi@MSI:~/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete$ wine HD3_Launcher.exe
(base) huishi@MSI:~/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete$ 0194:err:module:loader_init "_hd3_.dll" failed to initialize, aborting
0194:err:module:loader_init Initializing dlls for L"C:\\Program Files (x86)\\3DO\\Heroes 3 Complete\\HEROES3 HD.exe" failed, status c0000005
01a0:err:module:loader_init "_hd3_.dll" failed to initialize, aborting
01a0:err:module:loader_init Initializing dlls for L"C:\\Program Files (x86)\\3DO\\Heroes 3 Complete\\HEROES3 HD.exe" failed, status c0000005
```

This is [a bug reported to wine][wine9-bug-report], it is suggested that upgrading to Wine 10 resolve the issue. Follow the [steps][wine10-upgrade] we will upgrade to wine10.

NOTE: you need to install i386 architect.
NOTE: one of the source link url is wrong, you need this:

```bash
sudo wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/noble/winehq-noble.sources
```

After this step you should be able to mount the cd iso file, emulate cd drive using `Wine`.

# Make the Sound Work

What I noticed is the sound is not quite working. Basically in order to support sound under `wine`, you need to use the PulseAudio server on the host (windows) and client (linux) and enable network connection between them.

pipewire may be an alternative to pulseaudio. haven't tried it up.

## install the server on windows
This [post][sound-on-wsl2] pointed to a working release of [PulseAudio 5 for Windows](https://github.com/pgaskin/pulseaudio-win32/releases/tag/v5), you can just download the [zip file](https://github.com/pgaskin/pulseaudio-win32/releases/download/v5/pulseaudio.zip) and unzip the content anywhere.

NOTE: PulseAudio 1.1 may work as well.

## configure the server on windows
followed this [link](https://x410.dev/cookbook/wsl/enabling-sound-in-wsl-ubuntu-let-it-sing/). Also the [link][sound-on-wsl2] mentioned the authentication for the newer wsl2 ip range. [This post](https://gist.github.com/xarinatan/c415341ff34eab445cfb073988dcf6c1) also explained some options. One may want to take a look at [the real pulse audio doc](https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/).

[for some virtual network related note](https://www.reddit.com/r/bashonubuntuonwindows/comments/c871g7/command_to_get_virtual_machine_ip_in_wsl2/)

my config files,

{% highlight bash %}
(base) huishi@MSI:/mnt/c/Users/huish/pkg/pulseaudio/etc/pulse$ ls -ltr
total 16
-rwxrwxrwx 1 huishi huishi 1209 Feb 17 20:57 client.conf
-rwxrwxrwx 1 huishi huishi 2235 Feb 17 20:57 system.pa
-rwxrwxrwx 1 huishi huishi 2757 Feb 17 21:02 default.pa
-rwxrwxrwx 1 huishi huishi 2111 Feb 17 21:13 daemon.conf
{% endhighlight %}

 i made the following changes
- `default.pa`
    - need to change the network authentication to allow connections from WSL network.
    - need to set `record=0` for window security
- `daemon.conf`:
    - exit idle to -1 to not exit
    - set sample related, perhaps not needed to set them.

to run the server:

```ps1
cd C:\Users\huish\pkg\pulseaudio\bin
.\pulseaudio.exe

# some other command
powershell -Command "& {Start-Process -NoNewWindow $env:USERPROFILE\pkg\pulseaudio\pulseaudio.exe}"
```

one could set `-v` and the log level to see how the server handles the sound streams.

## install the pulse audio client on WSL2

Pretty simple, just install the pkg.

```bash
sudo apt install pulseaudio
```

## setting the environment on WSL2

set the server (the host windows) IP address so that the linux client can stream the sound data into the server

```bash
export PULSE_SERVER=tcp:192.168.0.105
# export PULSE_COOKIE=/mnt/c/Users/huish/.pulse-cookie ## not sure about this. i unset it and use the acl auth anyway.
```

[This post](https://www.reddit.com/r/bashonubuntuonwindows/comments/hrn1lz/comment/gid61yq/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) mentioned about using cookie.

## The final touch

After running the server on windows and set the pulse server on linux, when playing sound I can see the logs on the win server -- need to run with verbose level log. I can hear sound.

But the sound is broken, cracking badly. I changed the sampling rate roughly following [this link](https://www.reddit.com/r/archlinux/comments/118kx61/audio_crackling_when_playing_some_wine_games/?rdt=40579), not sure it helped. Then [this post](https://askubuntu.com/questions/392911/wine-sound-is-played-way-too-fast-and-crackles-horribly) mentioned `PULSE_LATENCY_MSEC=60`.

```bash
export PULSE_LATENCY_MSEC=60
(base) huishi@MSI:~/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete$ wine HD3_Launcher.exe
```

set it in my app env, and Yay it worked.

# Persist the Changes

## setup the windows service

one may want to setup a service. see the references in the posts listed above.

## change the bashrc on ubuntu

# Install H3MM Complete

## convert ccd into iso

[ccd2iso](https://unix.stackexchange.com/questions/73904/how-do-i-mount-a-clonecd-img-file)

```bash
ccd2iso MyImage.img MyImage.iso
```

## mount iso

```bash
sudo mount -o loop -t iso9660 ~/tmp/h3/install.iso /mnt/cd
sudo mount -o loop -t iso9660 ~/tmp/h3/play.iso /mnt/cd
```

[mount iso](https://unix.stackexchange.com/questions/73904/how-do-i-mount-a-clonecd-img-file)
[general fdisk mount iso discussion](https://www.linuxquestions.org/questions/linux-general-1/how-to-mount-img-file-882386/#google_vignette)

## install H3 complete in wine
## install HD Launcher
lost the original installer. just run the existing hd loader exe.
![diff-0](/assets/images/h3hd/image.png)
![diff-1](/assets/images/h3hd/image-1.png)
```bashrc
(base) huishi@MSI:~/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete$
rsync -avz -e "ssh -p 22" --delete huishi@192.168.0.115:"/home/huishi/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete/" "/home/huishi/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete/"
```

## make TCP/IP game to work
install `winetricks`
then use `winetricks` to install direct play
```bash
export WINEPREFIX="$HOME/prefix32"  # or whatever your wine i386 installation path is.
export WINEARCH=win32
wine wineboot
winetricks directplay
winecfg  # to setup the cd drive.

## if a different WINEPREFIX had been used between different wine setup/game installations, 
## you might run into issues on launching the game, in that case, just get into the dir of
## of the game exe, run `wine game.exe` there.
```
you have to make sure your `wine` installation is using `win32` architect.
Now the game should be able to get into host a tcp ip game window, but it will stuck in there.

In order to solve that problem. you have to 
[remove a file](https://www.reddit.com/r/wine_gaming/comments/ehc1ql/comment/fcq65q5/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button). After this it appears I can host a game, but another game instance on the same network can't find it. Perhaps some port related settings on the router/firewall. Some reference on [the ports used by direct play](http://heroescommunity.com/viewthread.php3?TID=10000)

> 2300 to 2400 TCP and UDP
> 6073 and 47624 TCP and UDP

still need to figure it out.

[wine9-bug-report]: https://bugs.launchpad.net/wine/+bug/2063511
[wine10-upgrade]: https://www.omgubuntu.co.uk/2023/01/install-wine-on-ubuntu
[sound-on-wsl2]: https://discourse.ubuntu.com/t/getting-sound-to-work-on-wsl2/11869/10