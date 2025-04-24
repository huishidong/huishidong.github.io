---
title:  "Struct and Trait in Rust"
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

# Composite type and behavior with `struct` and `trait`

## `struct`

All fields need to have the same mutability, ie. a struct object can be mutated as a whole, or not. A struct is just memory location with tags on each comsiting piece.

```rust
// there's no default value declaration for field.
// but default trait can be used
// one can define a construction function. Usual name is `new`, `default`
#[derive(Debug)]
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

// order doesn't matter in this case
fn build_user(email: String, username: String) -> User {
    User {
        username: username,
        email: email,
        sign_in_count: 1,
        active: true,
    }
}

// short hand
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}

// update
let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};
println!("user2 is {user2:?}"); // {:#?} will do pretty print

// tuple struct
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
// black and origin are different type, not a tuple type.
let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);

// unit-like struct, it is NOT a void tuple `()`
struct AlwaysEqual;
```

`self` and `Self` are the object and the type of the object. They can be used by the struct **method**.

```rust
#[derive(Debug)]
struct Rectangle<T> {
    width: T,
    height: T,
}

// With T attached to impl, the T in Rectangle<T> can NOT be a concrete type.
impl<T> Rectangle<T> {
    fn square(size: T) -> Self {
        Self {
            width: size,
            height: size,
        }
    }

    fn area(&self) -> T {
        self.width * self.height
    }
}

// this is the template specification.
impl Rectangle<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

```

## `trait`

### defining a `trait`

```rust
// trait with default behavior
pub trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

// trait with associated type. 
// any struct implementing this trait needs to define Item
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // methods with default implementations elided
}

// use a trait with associated type
impl Config {
    pub fn build(
        mut args: impl Iterator<Item = String>,
    ) -> Result<Config, &'static str> {
        args.next();
        ...
    }


```

### use a `trait`

```rust
// trait as type, items can be of different type with Summary trait
pub fn notify(item1: &impl Summary, item2: &impl Summary) {
    println!("Breaking news! {}", item1.summarize());
}

// trait as generic type bound, items must be of the exact same type
pub fn notify<T: Summary>(item1: &T, item2: &T) {
    println!("Breaking news! {}", item1.summarize());
}

// composite traits
pub fn notify(item: &(impl Summary + Display)) {
    ...
}

fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {
    ...
}

// use where for a cleaner declaration
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{...}

// returning a trait. all returns from the function MUST be of the SAME TYPE
// beside requiring the trait.
fn returns_summarizable(switch: bool) -> impl Summary {
    ...
}
```

### Generic Trait with default type

usually the traits doesn't require an generic type due to the Self and associated type, but it can use useful in some situations:

```rust
// std::ops::Add
trait Add<Rhs=Self> {
    type Output;

    fn add(self, rhs: Rhs) -> Self::Output;
}

// a real example
struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;

    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + (other.0 * 1000))
    }
}
```

### Combine traits with struct

```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

// Using Trait Bounds to Conditionally Implement Methods
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}

// implement trait for a struct
impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
}
```

`<Type as Trait>::function(receiver_if_method, next_arg, ...);`