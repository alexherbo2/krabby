# Configuration for [Chrome]

> Configuration example to [create a keyboard interface to the web].

## Demos

### Download 3-gatsu no Lion episodes from HorribleSubs

[![Download 3-gatsu no Lion episodes from HorribleSubs](https://img.youtube.com/vi_webp/aXaFt75lIqo/maxresdefault.webp)](https://youtu.be/aXaFt75lIqo)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>o</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (2 times)
- <kbd>Alt</kbd> + <kbd>i</kbd> → Select child elements (2 times)
- <kbd>Enter</kbd> → Open link
- <kbd>Alt</kbd> + <kbd>i</kbd> → Select child elements
- <kbd>Alt</kbd> + <kbd>k</kbd> → Keep selections that match the given [RegExp][Regular Expressions]
  - Input: `720p`
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>Alt</kbd> + <kbd>k</kbd> → Keep selections that match the given [RegExp][Regular Expressions]
  - Input: `Magnet`
- <kbd>o</kbd> → Open link in the associated application

### Extract from Wikipedia the list of cities and towns in Russia

[![Extract from Wikipedia the list of cities and towns in Russia](https://img.youtube.com/vi_webp/PJXCnRBkHDY/maxresdefault.webp)](https://youtu.be/PJXCnRBkHDY)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>a</kbd>, <kbd>l</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (3 times)
- <kbd>S</kbd> → Select elements that match the specified group of selectors
  - Input: `tr td:first-child`
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>Alt</kbd> + <kbd>y</kbd> → Copy link text

### Quickly move around a document with no table of contents

[![Quickly move around a document with no table of contents](https://img.youtube.com/vi_webp/gp4_6VGXkOk/maxresdefault.webp)](https://youtu.be/gp4_6VGXkOk)

**Commands**

- <kbd>%</kbd> → Select document
- <kbd>S</kbd> → Select elements that match the specified group of selectors
  - Input: `h1, h2, h3`
- <kbd>(</kbd> → Focus previous selection

### Tab search with dmenu

[![Tab search with dmenu](https://img.youtube.com/vi_webp/tgrmss3u2aE/maxresdefault.webp)](https://youtu.be/tgrmss3u2aE)

**Commands**

- <kbd>q</kbd> → Tab search with [dmenu]

### Playing videos in picture-in-picture mode

[![Playing videos in picture-in-picture mode](https://img.youtube.com/vi_webp/zgSx1AE6pig/maxresdefault.webp)](https://youtu.be/zgSx1AE6pig)

**Commands**

- <kbd>p</kbd> → Toggle picture-in-picture mode

### Opening links in a paragraph

[![Opening links in a paragraph](https://img.youtube.com/vi_webp/v2Jvk1rhIlc/maxresdefault.webp)](https://youtu.be/v2Jvk1rhIlc)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>e</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>Control</kbd> + <kbd>Enter</kbd> → Open link in new tab

### Play videos with mpv

[![Play videos with mpv](https://img.youtube.com/vi_webp/gYTi-eXuWdI/maxresdefault.webp)](https://youtu.be/gYTi-eXuWdI)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>a</kbd>, <kbd>w</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (3 times)
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>Alt</kbd> + <kbd>m</kbd> → Play with [mpv] in reverse order

## Dependencies

- [Inkscape] (Inkscape is used to convert SVG to PNG)

### Extensions

- [Commands] (Chrome API to perform browser actions)
- [Shell] (Chrome API to execute external commands)
- [dmenu][chrome-dmenu] (Tab search with [dmenu])

## Installation

### Installing from the Chrome Web Store

https://chrome.google.com/webstore/detail/configuration/gkmignamlolbclcnmhlijklgaenooonk

### Installing from the source

``` sh
make
```

Open the _Extensions_ page by navigating to `chrome://extensions`, enable _Developer mode_ then _Load unpacked_ to select the extension directory.

![Load extension](https://developer.chrome.com/static/images/get_started/load_extension.png)

See the [Getting Started Tutorial] for more information.

[Chrome]: https://google.com/chrome/
[Create a keyboard interface to the web]: https://alexherbo2.github.io/blog/chrome/create-a-keyboard-interface-to-the-web/
[Getting Started Tutorial]: https://developer.chrome.com/extensions/getstarted
[Commands]: https://github.com/alexherbo2/chrome-commands
[Shell]: https://github.com/alexherbo2/chrome-shell
[chrome-dmenu]: https://github.com/alexherbo2/chrome-dmenu
[Inkscape]: https://inkscape.org
[dmenu]: https://tools.suckless.org/dmenu/
[mpv]: https://mpv.io
[Regular Expressions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
