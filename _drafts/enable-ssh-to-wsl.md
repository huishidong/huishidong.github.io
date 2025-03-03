---
title:  "SSH Server on Ubuntu 24.04 LTS under Win11 WSL2"
excerpt: "Open up ssh server under WSL/WSL2"
date:   2025-02-17 21:42:39 -0600
date:   2025-02-17 21:42:39 -0600
categories: ubuntu wifi
last_modified_at: 2025-02-18 14:42:39 -0600
taxonomy: ubuntu
tags: system wifi intel ubuntu
page_css:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
line_numbers: true
---

# enable ssh in wsl2

[some tutorial](https://serverfault.com/questions/1159599/how-to-change-the-ssh-server-port-on-ubuntu)

```ps1
ipconfig
#netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=2222 connectaddress=192.168.252.166 connectport=2222
#netsh advfirewall firewall add rule name="open port 2222 for wsl2" dir=in action=allow protocol=TCP localport=2222
## turns out i haven't changed the local wsl ssh port to 2222. it is still the default 22.
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=2222 connectaddress=192.168.252.166 connectport=22
netsh advfirewall firewall add rule name="open port 2222 for wsl2" dir=in action=allow protocol=TCP localport=22
```

to play GUI app on the mbp i set the display to this:

```bash
(base) huishi@MSI:~/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete$ export DISPLAY=localhost:10.0
(base) huishi@MSI:~/.wine/drive_c/Program Files (x86)/3DO/Heroes 3 Complete$ echo $DISPLAY
localhost:10.0
```
