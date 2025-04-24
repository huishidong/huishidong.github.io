---
title:  "Thread and Async"
# excerpt: "rust project structure"
date:   2025-04-06 14:02:15 -0500
categories: rust
last_modified_at: 2025-04-06 10:56:08 -0500
# taxonomy: IDE
tags: rust
page_css:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
---

# Thread and Async

Let's see how the safty rules are being used in the real life way of logic execution with rust.

## using thread

spawing a thread returns a `JoinHandle<T>` that can be `join`-ed.

### `thread::spawn` and `handle::join`

### `Mutext<T>` and `MutexGuard`

### `mpsc::channel()`

### `Arc<T>`

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

RefCell<T>/Rc<T> and Mutex<T>/Arc<T>

### `std::marker::{Sync, Send}` traits

As marker traits, they don’t even have any methods to implement. They’re just useful for enforcing invariants related to concurrency. Implementing Send and Sync Manually Is Unsafe. Instead we often just use these rules:

- Any type composed entirely of `Send` types is automatically marked as `Send` as well. Almost all primitive types are Send, aside from raw pointers.
- Any type composed entirely of `Sync` types is automatically marked as `Sync` as well.
- Any type T is `Sync` if `&T` (an immutable reference to `T`) is `Send`

## `async`, `await`, `Future<Output=...>` and `stream`

`async` returns an `future`, which can be `await`-ed. We can also `trpl::join` multiple `futures` which in turn returns a future to be waited.

```rust
async fn page_title(url: &str) -> Option<String> {
    let response = trpl::get(url).await;
    let response_text = response.text().await;
    Html::parse(&response_text)
        .select_first("title")
        .map(|title_element| title_element.inner_html())
}

// is equavalent to the following code
use std::future::Future;
use trpl::Html;
// the returned future has a reference to the input url
// since there's only one input life time, the output life time can use '_
fn page_title(url: &str) -> impl Future<Output = Option<String>> + '_ {
    async move {
        let text = trpl::get(url).await.text().await;
        Html::parse(&text)
            .select_first("title")
            .map(|title| title.inner_html())
    }
}

// managing the Future<Output=...> state with trpl::run(...)
fn main() {
    let args: Vec<String> = std::env::args().collect();

    trpl::run(async {
        let url = &args[1];
        match page_title(url).await {
            Some(title) => println!("The title for {url} was {title}"),
            None => println!("{url} had no title"),
        }
    })
}
```

### Joining Futures

```rust
let a = async { 1u32 };
let b = async { "Hello!" };
let c = async { true };

let (a_result, b_result, c_result) = trpl::join!(a, b, c);
println!("{a_result}, {b_result}, {c_result}");
```

```rust
let tx1_fut = pin!(async move {
    // --snip--
});

let rx_fut = pin!(async {
    // --snip--
});

let tx_fut = pin!(async move {
    // --snip--
});

let futures: Vec<Pin<&mut dyn Future<Output = ()>>> =
    vec![tx1_fut, rx_fut, tx_fut];

trpl::join_all(futures).await;

```

### Implementing a timeout with `race`

```rust
fn main() {
    trpl::run(async {
        let slow = async {
            trpl::sleep(Duration::from_secs(5)).await;
            "Finally finished"
        };

        match timeout(slow, Duration::from_secs(2)).await {
            Ok(message) => println!("Succeeded with '{message}'"),
            Err(duration) => {
                println!("Failed after {} seconds", duration.as_secs())
            }
        }
    });
}

async fn timeout<F: Future>(
    future_to_try: F,
    max_time: Duration,
) -> Result<F::Output, Duration> {
    match trpl::race(future_to_try, trpl::sleep(max_time)).await {
        Either::Left(output) => Ok(output),
        Either::Right(_) => Err(max_time),
    }
```

### `StreamExt` 

#### from iterator

```rust
use trpl::StreamExt;

fn main() {
    trpl::run(async {
        let values = 1..101;
        let iter = values.map(|n| n * 2);
        let stream = trpl::stream_from_iter(iter);

        let mut filtered =
            stream.filter(|value| value % 3 == 0 || value % 5 == 0);

        while let Some(value) = filtered.next().await {
            println!("The value was: {value}");
        }
    });
}
```

#### from channel to stream

```rust
use std::{pin::pin, time::Duration};
use trpl::{ReceiverStream, Stream, StreamExt};

fn get_messages() -> impl Stream<Item = String> {
    let (tx, rx) = trpl::channel();

    trpl::spawn_task(async move {
        let messages = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
        for (index, message) in messages.into_iter().enumerate() {
            let time_to_sleep = if index % 2 == 0 { 100 } else { 300 };
            trpl::sleep(Duration::from_millis(time_to_sleep)).await;

            tx.send(format!("Message: '{message}'")).unwrap();
        }
    });

    ReceiverStream::new(rx)
}

fn main() {
    trpl::run(async {
        let mut messages =
            pin!(get_messages().timeout(Duration::from_millis(200)));

        while let Some(result) = messages.next().await {
            match result {
                Ok(message) => println!("{message}"),
                Err(reason) => eprintln!("Problem: {reason:?}"),
            }
        }
    })
}
```

#### merge streams into one stream

```rust

```

### other useful things

- `trpl::yield_now().await`
- `trpl::race(slow, fast).await;`
- `futures::stream::FuturesUnordered`
- `trpl::spawn_task(future)`

