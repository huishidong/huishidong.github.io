---
title:  "Rust Syntax"
# excerpt: "rust"
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

# Rust Language Features From A C++ Developer

Most languages derived their concepts from C. And given the versatile of the C++, most of the features of a languages will have correspondence in C++. 

So as an experienced C++ develoiper, we will focus on the uniqueness of the rust, and compare it with what's available in C++.

## Built-in Data Types

```rust
// char
let heart_eyed_cat = '😻';  // four bytes Unicode Scalar Value
// numbers
let quotient = 56.7 / 32.2;
let truncated = -5 / 3; // Results in -1
let Decimal =	98_222;
let Hex =	0xff;
let Octal =	0o77;
let Binary =	0b1111_0000;
let Byte = b'A';  // u8 only
let a_i8: i8 = -2;
// array
let a: [i32; 5] = [1, 2, 3, 4, 5];
let a = [3; 5];  // [3, 3, 3, 3, 3]
// tuple
let x: (i32, f64, u8) = (500, 6.4, 1);
let five_hundred = x.0;
let six_point_four = x.1;
let (x, y, z) = x;

// let-else as a variant for if-
let Some(x) = some_option_value else { todo!() };
fn describe_state_quarter(coin: Coin) -> Option<String> {
    let Coin::Quarter(state) = coin else {
        return None;
    };

    if state.existed_in(1900) {
        Some(format!("{state:?} is pretty old, for America!"))
    } else {
        Some(format!("{state:?} is relatively new."))
    }
}
```

Things worth noting: **decomposition**

## Block `{}` and Function `fn`

A execution block can happen mostly anywhere.
A function is just a named block that can be referred to and invoked later.
An anonamous block is just a function that needs to be executed immediately, since you don't have a way to refer to it later.

```rust
let y = {
    let x = 3;
    x + 1
};

fn five() -> i32 {
    5
}

// async block:
let a = async { 1u32 }; // `a` is a Future.
```

## `if`

```rust
// no default convertion to boolean
if number % 4 == 0 {
    println!("number is divisible by 4");
} else if number % 3 == 0 {
    println!("number is divisible by 3");
} else if number % 2 == 0 {
    println!("number is divisible by 2");
} else {
    println!("number is not divisible by 4, 3, or 2");
}

// ?: operator
let number = if condition { 5 } else { 6 };  // same type

// if-let, local scope temp variable generated with decomposition
if let Message::Text(text) = msg {
    match crate::data_handler::get_top_n_bids_asks_raw(&text, top_n) {
      Ok((bids, asks)) => { ... }
      Err(e) => { ... }
    }
} else if let Message::Ping(ping) = msg {
  ...
} else {
  ...
}

```

## `loop` and `break`

```rust
//  loop will repeat an execution block
let result = loop {
    counter += 1;

    if counter == 10 {
        break counter * 2;
    }
};

//  labeled loop-break
'counting_up: loop {
    println!("count = {count}");
    let mut remaining = 10;

    loop {
        println!("remaining = {remaining}");
        if remaining == 9 {
            break;
        }
        if count == 2 {
            break 'counting_up;
        }
        remaining -= 1;
    }

    count += 1;
}
```

## `while`

```rust
//  while is just a loop with condition
'tag: while number != 0 {
    println!("{number}!");

    number -= 1;
    if number < 100 { break 'tag; }
}
```

## `for`

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

## `enum`, `match`, `@` binding and the `?` operator

An enum item can be referred to without the enum type. If there will be conflict, you can prepend the enum type, eg. `Option::None`.

enums are powerful in pattern matching. Each match arm with the matched variables has its own local scope.

```rust
// match and ignore
let dice_roll = 9;
let y = 2;
match dice_roll {
    x if x % y == 0 => println!("The number {x} is multiple of {y}"),
    3 | 5 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    8..=100 => (), // NOTE: ..=, not just ..
    other => move_player(other), // or _ for other if you don't care other value
}

// skip
let numbers = (2, 4, 8, 16, 32);

match numbers {
    (first, .., last) => {
        println!("Some numbers: {first}, {last}");
    }
}

// decomp
match p {
    Point { x, y: 0 } => println!("On the x axis at {x}"),
    Point { x: 0, y } => println!("On the y axis at {y}"),
    Point { x, y } => {
        println!("On neither axis: ({x}, {y})");
    }

// herotic matching
enum Color {
    Rgb(i32, i32, i32),
    Hsv(i32, i32, i32),
}
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
let msg = Message::ChangeColor(0, 160, 255);
match msg {
    Message::Quit => {
        println!("The Quit variant has no data to destructure.");
    }
    Message::Move { x, y } => {
        println!("Move in the x direction {x} and in the y direction {y}");
    }
    Message::Write(text) => {
        println!("Text message: {text}");
    }
    Message::ChangeColor(Color::Rgb(r, g, b)) => {
        println!("Change color to red {r}, green {g}, and blue {b}");
    }
    Message::ChangeColor(Color::Hsv(h, s, v)) => {
        println!("Change color to hue {h}, saturation {s}, value {v}");
    }
}

// @ binding
enum Message {
    Hello { id: i32 },
}

let msg = Message::Hello { id: 5 };

match msg {
    Message::Hello {
        id: id_variable @ 3..=7,
    } => println!("Found an id in range: {id_variable}"),
    Message::Hello { id: 10..=12 } => {
        println!("Found an id in another range")
    }
    Message::Hello { id } => println!("Found some other id: {id}"),
}
```

### Rust defined enums `Option`:

```rust
enum Option<T> {
    None,
    Some(T),
}

// create items
let some_char = Some('e');
let absent_number: Option<i32> = None;
```

### Rust defined enums `Result`

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`?` can be used on returned `Result` and `Option` and it will do early return if it encounters and `Err` or `None`. In case of `Err` it will try to convert received `Err` into the expected `Err` type.

## function scope nested definitions

To encapuslate definitions, one can define them within a function.

### rust defined enums `Either`

```rust
enum Either<A, B> {
    Left(A),
    Right(B),
}
```

```rust
pub fn get_top_n<T>(json_str: &str, n: usize) -> Result<(PxQtLadder, PxQtLadder), Box<dyn std::error::Error>>
where
    T: PxQtBook + serde::de::DeserializeOwned,
{
    struct TopNArray {
        n: usize,
    }

    impl<'de> de::DeserializeSeed<'de> for TopNArray {
        ...
    }

    impl<'de> Visitor<'de> for TopNVisitor {
        type Value = (PxQtLadder, PxQtLadder);

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("a JSON object with 'bids' and 'asks'")
        }

        fn visit_map<M>(self, mut map: M) -> Result<Self::Value, M::Error>
        where
            M: MapAccess<'de>,
        {
            let mut bids = PxQtLadder::new();
            let mut asks = PxQtLadder::new();

            while let Some(key) = map.next_key::<&str>()? {
                match key {
                    "bids" => {
                        bids = map.next_value_seed(TopNArray { n: self.n })?;
                    }
                    "asks" => {
                        asks = map.next_value_seed(TopNArray { n: self.n })?;
                    }
                    _ => {
                        let _ignored: serde_json::Value = map.next_value()?;
                    }
                }
            }

            Ok((bids, asks))
        }
    }

    let visitor = TopNVisitor { n };
    let mut de = serde_json::Deserializer::from_str(raw_json);
    let result = de.deserialize_map(visitor)?;
    Ok(result)
}
```

## closure

### defining a closure

```rust
let example_closure = |x| x;
// bind the closure to type.
let s = example_closure(String::from("hello"));
// can not reuse it for another type.
let n = example_closure(5); // this is a compiler error
```

### borrow capture

```rust
let mut list = vec![1, 2, 3];
println!("Before defining closure: {list:?}");

let mut borrows_mutably = || list.push(7);
// can not use `list` here since it's borrowed by the closure
// see the section about FnOnce
borrows_mutably();
println!("After calling closure: {list:?}");
```

###  move capture

```rust
let list = vec![1, 2, 3];
println!("Before defining closure: {list:?}");

thread::spawn(move || println!("From thread: {list:?}"))
    .join()
    .unwrap();
```

### `Fn, FnOnce, FnMut`

A closure can implements at least the following traits:
1. `FnOnce` applies to closures that can be called once. **All closures implement at least this trait**, because all closures can be called. A closure that moves captured values out of its body will only implement FnOnce and none of the other Fn traits, because it can only be called once.
2. `FnMut` applies to closures that don’t move captured values out of their body, but that might mutate the captured values. These closures can be called more than once.
3. `Fn` applies to closures that don’t move captured values out of their body and that don’t mutate captured values, as well as closures that capture nothing from their environment. These closures can be called more than once without mutating their environment, which is important in cases such as calling a closure multiple times concurrently.

for example, in `std`

```rust
impl<T> Option<T> {
    pub fn unwrap_or_else<F>(self, f: F) -> T
    where
        F: FnOnce() -> T
    {
        match self {
            Some(x) => x,
            None => f(),
        }
    }
}
```
