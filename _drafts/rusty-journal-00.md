---
title:  "The Rusty Journey Of A C++ Veteran"
# excerpt: "rust project to "
date:   2025-04-04 18:16:08 -0500
categories: rust
last_modified_at: 2025-04-06 10:56:08 -0500
# taxonomy: IDE
tags: rust vscode
page_css:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
---

# Start learning Rust

Need to finish a coding test, so why not. So far I have been really impressed.

## setup rust with vscode

Great IDE plugin: `rust-analyzer`. I am using Rust under wsl2 (Ubuntu) through windows vscode+remote tunnel.

the steps:

1. install the rust-analyzer plugin onto wsl in vscode
2. [checkout the documentations](https://rust-analyzer.github.io/book/installation.html).


## The potential issues:

### rust-analyzer won't start
One issue I had is described [here](https://github.com/rust-lang/rust-analyzer/issues/11673). Nothing worked, including restart VSCode, run it from commandline where cargo and rusty-analyzer are clearly in the `$PATH`.

To resolve it, I had to install rusty-analyzer manually, include it in my `$PATH`, then modify the VSCode settings:
```json
// /C:/Users/huish/AppData/Roaming/Code/User/settings.json
    ...
    "terminal.integrated.env.linux": {
        "PATH": "/home/huishi/.cargo/bin:${env:PATH}"
    },
    "rust-analyzer.runnableEnv": {
        "PATH": "/home/huishi/.cargo/bin:${env:PATH}"
    },
    ...
```

### make rusty-analyzer to support async trait

The error message async_trait: proc-macro-srv is not running typically occurs in Rust projects when there is an issue with the procedural macro server used by the Rust Analyzer in Visual Studio Code. This can happen due to a misconfiguration, outdated dependencies, or issues with the IDE setup.

```json
"rust-analyzer.procMacro.enable": true
```

### unable to start debug with rust-analyzer

it turns out that rust-analyzer is unable to build and debug in one shot of click on the debug button after you make some code changes. It complains about linker `cc` is not found. So to work around it, you just need to click the run button, make sure the project is built successfully, then you can start debug.


## conclusion

Now everything seems to be working. I can click `Run/Debug` on the test case or main functions to let the rusty-analyzer invoke the cargo command. And the coding suggestions/auto-complete is absolutely helpful for a Rust beginner.

## additional learning resources

Learn Rust with rustling and the `book`

- [The book](https://doc.rust-lang.org/book/title-page.html)
- [`rustling`](https://github.com/rust-lang/rustlings)
- [rust by example](https://doc.rust-lang.org/rust-by-example/std.html)
- [r4cpp](https://github.com/nrc/r4cppp?tab=readme-ov-file)

https://github.com/wisespace-io/binance-rs

https://tms-dev-blog.com/easily-connect-to-binance-websocket-streams-with-rust/

https://onur-karaduman.medium.com/building-a-real-time-market-data-client-in-rust-with-websockets-b5b9d798c0d9

https://github.com/huishidong/bookworm#

https://testnet.binance.vision/api/v3/depth?symbol=BNBBTC&limit=5000