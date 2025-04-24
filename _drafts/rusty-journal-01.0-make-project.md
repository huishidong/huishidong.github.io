---
title:  "Rust Project Structure"
# excerpt: "rust project structure"
date:   2025-04-06 14:02:15 -0500
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

# Rust Project Organization

some concepts:

## Workspace

A complex rust project is likely contained inside of a [workspace](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html). A workspace is a set of packages that share the same Cargo.lock and output directory.

## Package and Crate

A simple rust project can be contained within a single [package](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html#managing-growing-projects-with-packages-crates-and-modules). It contains a single `Cargo.toml` (similar to a top level `CMakeLists.txt`). The collection of the compiling/linking artifacts of a package is a `crate`.

### build a package

A package could be a `bin` or `lib` package, or both. In other word, the result of building a package is an executable, or a library/module, or both. The crate root file (usually src/lib.rs for a library crate or src/main.rs for a binary crate) is the entry point for compiler to create a crate.

And as implied from the above, you are not limited to one, you can have multiple executables defined my multiple source files, and you can have multiple modules.

### Modules and Submodules

A package can contain multiple modules, and a module could contain sub-modules... The content of a package module is organized as a tree. The root of the tree is called the `crate` root.

A module has to be **declared** first, then **defined**. The two steps can be done at once inside of the crate root file. Or more likely in real projects, declared somewhere -- better in the top level lib.rs as a  convention -- then defined in its own module file, eg. `src/module_a.rs`.

Submodules are declared and defined in the similar way. Instead of a top level module file, we use subdirectories, eg. `src/module_a/submod_1.rs`.

This is very similar to python's `__init__.py` inside of subdirs

### Using and Exposing Module
A module is referred to in your code just like a namespace in C++.
We can alias a name with [`as`](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#providing-new-names-with-the-as-keyword), and re-expose a name with complex module scope with [pub use](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#re-exporting-names-with-pub-use). 

When using a `pub mod name` the `name` would be exposed as `name` at its parent level recursively. Note that the parent name of a top level module is the package name, so if in this [example in the book](https://doc.rust-lang.org/book/ch07-05-separating-modules-into-different-files.html#separating-modules-into-different-files), we changed the first line `mod front_of_house` in `src/lib.rs` to `pub mod front_of_house`, then `front_of_house` would need to be referred as `the_book::front_of_house`, and the `hosting` would be `the_book::hosting`, supposed the name of the package name in the `Cargo.toml` is `the_book`.

