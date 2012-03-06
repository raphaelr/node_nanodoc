nanodoc template
================
Thanks for using [nanodoc](https://github.com/raphaelr/node_nanodoc)! To get started,
add your own input files to the `doc/input` folder. You can (and probably should!) also
change the template in `doc/data/template.html` and `doc/data/css/site.css`.

Please also read the [Readme](https://github.com/raphaelr/node_nanodoc/blob/master/README.md),
which contains a lot of useful information about using nanodoc.

Links
-----
To create links to other pages in the documentation, use the standard Markdown link
syntax. You need to replace every `/` in the path with a `.` and append a `.html`.
E.g. if you want to link to `doc/input/api/god-object.md` use the markdown

    [link text](api.god-object.html)

Design demonstration
--------------------

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---------------------------------------------------------------------------------------

    This is a block of preformatted text. There could also be
    source code in here.

1. This is an
2. ordered list.
3. It can also have
   1. multiple sublevels.
   2. They look like
      1. this.

----------

* Next, we have
* an unordered list.
  - Just like with ordered lists,
  - it can also have sublevels.
     + Possibly even more than one.

> This is a blockquote. You can use it to flame the hell out of people who annoy you
> on mailing lists, forums, etc. Sometimes you might also need to quote useful stuff,
> so it's probably not a bad thing if they look good.

We've already seen some [links](http://nodejs.org "node.js") in this file, but this time
I put a title on it. And this is a [reference link][refl]. This paragraph also contains
other inline elements like *emphasis*, **strong emphasis**, ***really strong emphasis***,
_underscoring_ and **_*derp ephasis*_**.

After this paragraph, you'll see the node.js logo two times, once using inline syntax
and once using reference syntax.

![node.js logo](http://nodejs.org/images/logos/nodejs.png "Inline syntax")
![node.js logo][node-logo]

Finally, here's an e-mail address using the automatic syntax: <me@example.org>.

[refl]: http://nodejs.org "nodejs.org"
[node-logo]: http://nodejs.org/images/logos/nodejs.png "Reference syntax"
