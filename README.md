Article Toc Chrome Extension 
======
Displays a clickable ToC of all topic headers for an article(first article in the page for now).

![Screenshot](https://raw.githubusercontent.com/dbkaplun/github-markdown-outline-extension/master/screenshot.png)

## Installation

Install via [Chrome Web Store](https://chrome.google.com/webstore/detail/github-markdown-outline-e/gccinjjdbfdkkkebfbeipopijjfohfgj).

## Usage

When you visit any page with article, this extension will automatically display a clickable ToC near right/left corner of window viewport.

To see all available options, copy and paste the following URL into Chrome: `chrome://extensions/?options=gccinjjdbfdkkkebfbeipopijjfohfgj`

## feature
* [x] auto-generate ids for headers without id
* [ ] domain white-list. let you decide which website can display the toc for any article
    * [ ] add specific article container selector for precise recognition, for those website with articles not placed inside `<article>` tag
* [ ] slideable ToC
* [ ] resizeable ToC
* [ ] auto resize with scroll position. (github specific)
* [ ] place at right/left corner in the window viewport(fixed position)
* [ ] manual refresh control button
* [ ] auto-detect page transition(page load, page history change, ...) for auto generation
* [x] display origin html of every captured header(`useInnerHtml`). This is inherit from the [upstream repo](https://github.com/dbkaplun/github-markdown-outline-extension)

## Development

* `git clone git@github.com:e-cloud/article-toc-chrome-extension.git`
* Go to `chrome://extensions` in Chrome
* Ensure the *Developer mode* checkbox is clicked
* Click the *Load unpacked extension...* button
* Select the `article-toc-chrome-extension` directory you just cloned
* Make sure the extension was added by refreshing this page
