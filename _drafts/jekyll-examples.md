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
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css
page_js:
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js
line_numbers: true
---

Excerpt with multiple paragraphs

Here's another paragraph in the excerpt.
<!--more-->

# Use Jekyll

## run it

Out-of-excerpt

[^structure]: See [**Structure** page]({{ "/docs/structure/" | relative_url }}) for a list of theme files and what they do.

**ProTip:** Be sure to remove `/docs` and `/test` if you forked Minimal Mistakes. These folders contain documentation and test pages for the theme and you probably don't want them littering up your repo.
{: .notice--info}

**Note:** The theme uses the [jekyll-include-cache](https://github.com/benbalter/jekyll-include-cache) plugin which will need to be installed in your `Gemfile` and added to the `plugins` array of `_config.yml`. Otherwise you'll throw `Unknown tag 'include_cached'` errors at build.
{: .notice--warning}


```bash
(base) huishi@MSI:~/work/huishidong.github.io 
bundle exec jekyll serve --draft
```

[an good example blog](https://blog.arkfeng.xyz/2021/06/12/pandas_notes/#1-%E8%AF%BB%E5%86%99%E6%96%87%E4%BB%B6)
layout: posts

You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

  When $$ a \ne 0 $$, there are two solutions to $$ ax^2 + bx + c = 0 $$ and they are
  $$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

## code highlight using liquid template
will contain line number with the setting at the mattermost at the the top.
{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
print_hi('Jerry')
{% endhighlight %}

## code highlight using markdown code block.
it will not include the line number.
```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

## code highlight using liquid with // to enable the file name.
note the comment line make the line number misaligned due to the different line spacing?
<!-- ```python -->
{% highlight python %}
<!-- # @name: My Script -->
// @name: My Script
def print_hi(name)
  print("Hi, {name}")

print_hi('Tom')
{% endhighlight %}
<!-- ``` -->

## c++ code highlight.
<!-- ```cpp  -->
{% highlight cpp %}
// @name: My C++ code
#include <iostream>
void print(std::string const& name) {
  std::cout<<"Hi, "<<name<<"\n";
}
{% endhighlight %}
<!-- ``` -->

<figure class="language-cpp highlighter-rouge">
<pre class="highlight line-numbers" data-start="10"><code><span class="cp">#include</span> <span class="cpf">&lt;iostream&gt;</span><span class="cp">
</span><span class="kt">void</span> <span class="nf">print</span><span class="p">(</span><span class="n">std</span><span class="o">::</span><span class="n">string</span> <span class="k">const</span><span class="o">&amp;</span> <span class="n">name</span><span class="p">)</span> <span class="p">{</span>
  <span class="n">std</span><span class="o">::</span><span class="n">cout</span><span class="o">&lt;&lt;</span><span class="s">"Hi, "</span><span class="o">&lt;&lt;</span><span class="n">name</span><span class="o">&lt;&lt;</span><span class="s">"</span><span class="se">\n</span><span class="s">"</span><span class="p">;</span>
<span class="p">}</span>
</code></pre>
</figure>

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

In equation \eqref{eq:sample}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:sample}
\end{equation}


<!-- ```javascript -->
{% highlight js %}
function helloWorld() {
    console.log("Hello, world!");
}
{% endhighlight %}
<!-- ``` -->

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
