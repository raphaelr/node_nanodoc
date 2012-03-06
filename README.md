nanodoc
=======
Very simple HTML documentation generator
----------------------------------------

nanodoc creates documentation from a HTML template and a bunch
of Markdown input files. It does not strive to be be feature-rich,
so it does not automatically push your stylesheets through SASS/Stylus.
Instead, it aims to be fast and simple to use.

Usage
=====

    $ npm install nanodoc
    $ cp -r node_modules/nanodoc/template/doc .
    $ vim doc/input/index.md
    $ node_modules/.bin/nanodoc
    $ your_browser doc/output/index.html

You don't even need to launch a server!

Useful notes
============
* Everything in the `doc/data` folder, including subdirectories, except the `template.html`
  are copied into the `doc/output` folder.
* Every `.md` and `.markdown` file in the input folder is fed into `showdown` and `jqtpl`,
  and the result is stored in the `doc/output` folder. Subdirectories become dots, e.g.
  `doc/input/api/god-object.md` becomes `doc/output/api.god-object.html`.
* The `doc/output` directory is purged everytime nanodoc runs.
* The title of the HTML files is the first Level-1 header (i.e. `<h1>`) of the input file.
* For best results, **don't** use absolute paths on Windows when using the API.

template.html substitutions
===========================
* **content**: The HTML of the input file
* **title**: The title of the input file, see above
* **navigation**: The navigation tree HTML

Requirements
============
* [node.js](http://nodejs.org) (obviously)
* The dependencies listed in [package.json](https://github.com/raphaelr/node_pcap-ffi/blob/master/package.json).

Roadmap
=======
* Automatic regeneration of the output directory if the input changes

License
=======
Copyright (c) 2012, Raphael Robatsch  
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
  notice, this list of conditions and the following disclaimer in the
  documentation and/or other materials provided with the distribution.
* The names of the authors and contributors may be used to endorse
  or promote products derived from this software without specific
  prior written permission.

**THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHORS AND CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.**
