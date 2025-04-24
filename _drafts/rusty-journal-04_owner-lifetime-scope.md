---
title:  "Mutability, Ownership, Life Time, Scope"
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

# Mutability, Ownership, Life Time, Scope

These are what makes the rust a safe language (tricky to learn at the same time) that:

1. no data-race
2. no leak
3. no unexpected side effect

## Copy, Drop and Scope

A data is either copied, or owned, can't have both.

Ownership is exclusive. Ownership can be thought of as a compiler internal tag mapped to a piece of data/memory location. It is assigned to a variable name.

With the exclusive property, rust compiler can telll when a ownership is dropped. drop an ownership, it will drop it.

## Reference

The Rules of References

1. At any given time, you can have either one mutable reference or any number of immutable references.
2. References must always be valid.

in order for reference to be valid, the **life time** of a reference is introduced.

## Life Time Scope
Because every reference has a life time (within which their referee is valid), when function or struct uses a reference, often time you need to specify a lift time annotation.

```rust
// life time annotation on function
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

// life time annotation on struct
struct ImportantExcerpt<'a> {
    part: &'a str,
}

// implied rules are applied
impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {announcement}");
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}

// life time with generic type
fn longest_with_an_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("Announcement! {ann}");
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

>The compiler uses three rules to figure out the lifetimes of the references when there aren’t explicit annotations. The first rule applies to input lifetimes, and the second and third rules apply to output lifetimes. If the compiler gets to the end of the three rules and there are still references for which it can’t figure out lifetimes, the compiler will stop with an error. These rules apply to fn definitions as well as impl blocks.

1. the compiler assigns a lifetime parameter to each parameter that’s a reference, ie. `fn foo<'a>(x: &'a i32);`, `fn foo<'a, 'b>(x: &'a i32, y: &'b i32);`

2. if there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters: `fn foo<'a>(x: &'a i32) -> &'a i32`.

3. for methods, the life time of `&self` or `&mut self` is assigned to all output lifetime parameters.

As an example, in the above example, `implied rules are applied`, there are two input lifetimes, so Rust applies the first lifetime elision rule and gives both &self and announcement their own lifetimes. Then, because one of the parameters is &self, the return type gets the lifetime of &self, and all lifetimes have been accounted for.

there's a static life time that should only be applied to global static data

```rust
let s: &'static str = "I have a static lifetime.";
```
