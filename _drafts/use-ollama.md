---
title:  "Serving AI models with Ollama on Windows"
excerpt: "Run deepseek R1 with ollama"
date:   2025-02-18 21:42:39 -0600
categories: system
last_modified_at: 2025-02-18 14:42:39 -0600
taxonomy: ai
tags: ollama nginx
page_css:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
line_numbers: true
---

# Run ollama as a service

[This post][ollama-setup-windows] shows how to
- install+run `ollama`
- install `nginx`
- setup local signed SSL certification
- setup `nginx` as a secure reverse proxy for serving `ollama`

```
# /mnt/c/Program Files/nginx/conf/openssl.cnf
[dn]
CN = localhost

[req]
distinguished_name = dn

[extensions]
subjectAltName = DNS:localhost
keyUsage = digitalSignature
extendedKeyUsage = serverAuth
```

```bash
(base) huishi@MSI:/mnt/c/Program Files/nginx/conf$ openssl req   -x509   -newkey rsa:2048   -nodes   -sha256   -days 365   -keyout ollama.key   -out ollama.crt   -subj "/CN=localhost"   -extensions extensions   -config /mnt/c/Users/huish/tmp/openssl.cnf
mv ollama.* /mnt/c/Program\ Files/nginx/conf/
(base) huishi@MSI:/mnt/c/Program Files/nginx/conf$ cp nginx.conf nginx.conf.0
(base) huishi@MSI:/mnt/c/Program Files/nginx/conf$ curl -k https://localhost:11435

```

```ps1
schtasks /create /tn "Start nginx" /tr "cmd.exe /c cd /d 'C:\Program Files\nginx' && start nginx" /sc onlogon /rl highest
schtasks /run /tn "Start nginx"
cd '.\Program Files\nginx\conf\' 
## openssl.exe not installed on windows. see above to generate the cert in linux
Import-Certificate -FilePath "ollama.crt" -CertStoreLocation "Cert:\LocalMachine\Root"
.\nginx.exe -t
.\nginx.exe -s reload

```

```bash
(base) huishi@MSI:~/pkg$ mv ollama-chats ~/winhome/pkg/
(base) huishi@MSI:~/pkg$ cd ~/winhome/pkg/ollama-chats/
(base) huishi@MSI:~/winhome/pkg/ollama-chats$
(base) huishi@MSI:~/winhome/pkg/ollama-chats$ ls
README.md  index.html  nginx-ollama.conf  screenshots  vue.prod.js
```

[deepseek write game](https://newmitbbs.com/viewtopic.php?f=26&t=711854&sid=8945d178f08ebf15caa393bcbf7edcc3)

[gen ai lectures](https://newmitbbs.com/viewtopic.php?t=637235)

[ollama-setup-windows]: https://gptforwork.com/help/ai-models/ollama/ollama-setup-windows
