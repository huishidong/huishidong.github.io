---
title:  "Jekyll Examples!"
categories: jekyll update
taxonomy: foo-tax
author_profile: false
toc: false
tags: foo bar baz
excerpt_separator: <!--more-->
sidebar:
  nav: "docs"
page_css:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
---

Excerpt with multiple paragraphs

Here's another paragraph in the excerpt.
<!--more-->
Out-of-excerpt

layout: posts

You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

  When $$ a \ne 0 $$, there are two solutions to $$ ax^2 + bx + c = 0 $$ and they are
  $$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

```python
# @name: My Script
def print_hi(name)
  print("Hi, {name}")

print_hi('Tom')
```

```cpp
#include <iostream>
void print(std::string const& name) {
  std::cout<<"Hi, "<<name<<"\n";
}
```

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

In equation \eqref{eq:sample}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:sample}
\end{equation}


```javascript
function helloWorld() {
    console.log("Hello, world!");
}
```

<!-- <div class="language-javascript"><div class="highlight">
<pre class="line-numbers" data-start=10><code class="language-javascript">
function helloWorld() {
    console.log("Hello, world!");
}
</code></pre>
</div></div> -->

{% for tag in site.tags %}
  <h3>{{ tag[0] }}</h3>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
