# Configuration for [Chrome]

###### [Installation](#installation) | [Configuration](config.js) | [Guides](#guides) | [Documentation](#commands) | [Browser compatibility](#browser-compatibility) | [Contributing](CONTRIBUTING)

> Configuration example to [create a keyboard interface to the web], heavily inspired by [Kakoune].

## TL;DR

**Chrome extension** — **Configuration** — **Keyboard interface** — **Multiple selections** — **Kakoune-inspired** — **Firefox-compatible**

Run the following in your terminal, then follow the onscreen instructions.

``` sh
curl -sSL https://git.io/JeGCO | sh
```

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
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> → Open link in the associated application

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

- [Zip] (Zip is used to package the extension)
- [Inkscape] (Inkscape is used to convert SVG to PNG when uploading the extension)

### Extensions

- [Commands] (Chrome API to perform browser actions)
- [Shell] (Chrome API to execute external commands)
- [dmenu][chrome-dmenu] (Tab search with [dmenu])

## Installation

### Installing from the web (Recommended)

Run the following in your terminal, then follow the onscreen instructions.

``` sh
curl -sSL https://git.io/JeGCO | sh
```

### Installing from the Chrome Web Store

https://chrome.google.com/webstore/detail/configuration/gkmignamlolbclcnmhlijklgaenooonk

Note this extension is an example of configuration.  You are encouraged to fork the repository to make your own configuration.

### Installing from the source

``` sh
make install
```

#### Chrome

Open the _Extensions_ page by navigating to `chrome://extensions`, enable _Developer mode_ then _Load unpacked_ to select the extension directory.

![Load extension](https://developer.chrome.com/static/images/get_started/load_extension.png)

#### Firefox

- Open `about:config`, change `xpinstall.signatures.required` to `false`.
- Open `about:addons` ❯ _Extensions_, click _Install add-on from file_ and select the package file.

## Guides

- [Chrome][Chrome – Getting Started Tutorial]
- [Firefox][Firefox – Your first extension]

## Commands

Commands are bound to physical keys and displayed with the US layout.

### Help

- <kbd>F1</kbd> → Show help (**Page** context)
- <kbd>Shift</kbd> + <kbd>F1</kbd> → Open the documentation in a new tab (**Page** context)

### Tab search

- <kbd>q</kbd> → Tab search with [dmenu] (**Command** context) – Requires [dmenu][chrome-dmenu]

### Scroll

- <kbd>j</kbd> → Scroll down (**Command** context)
- <kbd>k</kbd> → Scroll up (**Command** context)
- <kbd>l</kbd> → Scroll right (**Command** context)
- <kbd>h</kbd> → Scroll left (**Command** context)

### Scroll faster

- <kbd>J</kbd> → Scroll page down (**Command** context)
- <kbd>K</kbd> → Scroll page up (**Command** context)
- <kbd>g</kbd> → Scroll to the top of the page (**Command** context)
- <kbd>G</kbd> → Scroll to the bottom of the page (**Command** context)

### Navigation

- <kbd>H</kbd> → Go back in history (**Command** context)
- <kbd>L</kbd> → Go forward in history (**Command** context)
- <kbd>u</kbd> → Go up in hierarchy (**Command** context)
- <kbd>U</kbd> → Go to the home page (**Command** context)
- <kbd>Alt</kbd> + <kbd>u</kbd> → Remove any URL parameter (**Command** context)

### Zoom

- <kbd>+</kbd> → Zoom in (**Command** context) – Requires [Commands]
- <kbd>-</kbd> → Zoom out (**Command** context) – Requires [Commands]
- <kbd>=</kbd> → Reset to default zoom level (**Command** context) – Requires [Commands]

### Create tabs

- <kbd>t</kbd> → New tab (**Command** context) – Requires [Commands]
- <kbd>T</kbd> → Restore tab (**Command** context) – Requires [Commands]
- <kbd>b</kbd> → Duplicate tab (**Command** context) – Requires [Commands]

### Create windows

- <kbd>n</kbd> → New window (**Command** context) – Requires [Commands]
- <kbd>N</kbd> → New incognito window (**Command** context) – Requires [Commands]

### Close tabs

- <kbd>x</kbd> → Close tab (**Command** context) – Requires [Commands]
- <kbd>X</kbd> → Close other tabs (**Command** context) – Requires [Commands]
- <kbd>Alt</kbd> + <kbd>x</kbd> → Close tabs to the right (**Command** context) – Requires [Commands]

### Refresh tabs

- <kbd>r</kbd> → Reload the page (**Command** context)
- <kbd>R</kbd> → Reload the page, ignoring cached content (**Command** context)
- <kbd>Alt</kbd> + <kbd>r</kbd> → Reload all tabs (**Command** context) – Requires [Commands]

### Switch tabs

- <kbd>Alt</kbd> + <kbd>l</kbd> → Next tab (**Command** context) – Requires [Commands]
- <kbd>Alt</kbd> + <kbd>h</kbd> → Previous tab (**Command** context) – Requires [Commands]
- <kbd>1</kbd> → First tab (**Command** context) – Requires [Commands]
- <kbd>0</kbd> → Last tab (**Command** context) – Requires [Commands]

### Move tabs

- <kbd>Alt</kbd> + <kbd>L</kbd> → Move tab right (**Command** context) – Requires [Commands]
- <kbd>Alt</kbd> + <kbd>H</kbd> → Move tab left (**Command** context) – Requires [Commands]
- <kbd>Alt</kbd> + <kbd>1</kbd> → Move tab first (**Command** context) – Requires [Commands]
- <kbd>Alt</kbd> + <kbd>0</kbd> → Move tab last (**Command** context) – Requires [Commands]

### Detach tabs

- <kbd>d</kbd> → Detach tab (**Command** context) – Requires [Commands]
- <kbd>D</kbd> → Attach tab (**Command** context) – Requires [Commands]

### Discard tabs

- <kbd>z</kbd> → Discard tab (**Command** context) – Requires [Commands]

### Mute tabs

- <kbd>Alt</kbd> + <kbd>m</kbd> → Mute tab (**Command** context) – Requires [Commands]
- <kbd>Alt</kbd> + <kbd>M</kbd> → Mute all tabs (**Command** context) – Requires [Commands]

### Pin tabs

- <kbd>Alt</kbd> + <kbd>p</kbd> → Pin tab (**Command** context) – Requires [Commands]

### Link hints

- <kbd>f</kbd> → Focus link (**Command** context)
- <kbd>F</kbd> → Select multiple links (**Command** context)
- <kbd>i</kbd> → Focus input (**Command** context)
- <kbd>v</kbd> → Focus video (**Command** context)

### Open links

- <kbd>Enter</kbd> → Open link (**Link** context)
- <kbd>Control</kbd> + <kbd>Enter</kbd> → Open link in new tab (**Link** context)
- <kbd>Shift</kbd> + <kbd>Enter</kbd> → Open link in new window (**Link** context)
- <kbd>Alt</kbd> + <kbd>Enter</kbd> → Download link (**Link** context)
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> → Open link in the associated application (**Link** context) – Requires [Shell]

### Selection manipulation

- <kbd>s</kbd> → Select active element (**Command** context)
- <kbd>S</kbd> → Select elements that match the specified group of selectors (**Command** context)
- <kbd>%</kbd> → Select document (**Command** context)
- <kbd>)</kbd> → Focus next selection (**Command** context)
- <kbd>(</kbd> → Focus previous selection (**Command** context)
- <kbd>Space</kbd> → Clear selections (**Command** context)
- <kbd>Control</kbd> + <kbd>Space</kbd> → Focus main selection (**Command** context)
- <kbd>Alt</kbd> + <kbd>Space</kbd> → Remove main selection (**Command** context)
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (**Command** context)
- <kbd>Alt</kbd> + <kbd>i</kbd> → Select child elements (**Command** context)
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links (**Command** context)
- <kbd>Alt</kbd> + <kbd>k</kbd> → Keep selections that match the given [RegExp][Regular Expressions] (**Command** context)
- <kbd>Alt</kbd> + <kbd>K</kbd> → Keep links that match the given [RegExp][Regular Expressions] (**Command** context)
- <kbd>Alt</kbd> + <kbd>j</kbd> → Clear selections that match the given [RegExp][Regular Expressions] (**Command** context)
- <kbd>Alt</kbd> + <kbd>J</kbd> → Clear links that match the given [RegExp][Regular Expressions] (**Command** context)

### Unfocus

- <kbd>Escape</kbd> → Unfocus active element (**Page** context)

### Pass keys

- <kbd>Alt</kbd> + <kbd>Escape</kbd> → Pass all keys to the page (**Page** context)

### Clipboard

- <kbd>y</kbd> → Copy page address (**Command** context)
- <kbd>Alt</kbd> + <kbd>y</kbd> → Copy page title (**Command** context)
- <kbd>Y</kbd> → Copy page address and title (**Command** context)
- <kbd>y</kbd> → Copy link address (**Link** context)
- <kbd>Alt</kbd> + <kbd>y</kbd> → Copy link text (**Link** context)
- <kbd>Y</kbd> → Copy link address and text (**Link** context)

### Player

- <kbd>Space</kbd> → Pause video (**Video** context)
- <kbd>m</kbd> → Mute video (**Video** context)
- <kbd>l</kbd> → Seek forward 5 seconds (**Video** context)
- <kbd>h</kbd> → Seek backward 5 seconds (**Video** context)
- <kbd>g</kbd> → Seek to the beginning (**Video** context)
- <kbd>G</kbd> → Seek to the end (**Video** context)
- <kbd>k</kbd> → Increase volume (**Video** context)
- <kbd>j</kbd> → Decrease volume (**Video** context)
- <kbd>f</kbd> → Toggle full-screen mode (**Video** context)
- <kbd>p</kbd> → Toggle picture-in-picture mode (**Video** context)

### mpv

- <kbd>Enter</kbd> → Play with [mpv] (**Video** context) – Requires [Shell]
- <kbd>m</kbd> → Play with [mpv] (**Link** context) – Requires [Shell]
- <kbd>Alt</kbd> + <kbd>m</kbd> → Play with [mpv] in reverse order (**Link** context) – Requires [Shell]

## Browser compatibility

| Web browser | Support |             Engine              |
| ----------- |:-------:|:-------------------------------:|
| [Chrome]    |    ✓    | [![Blink][chrome.svg]][Blink]   |
| [Firefox]   |    ✓    | [![Gecko][firefox.svg]][Gecko]  |
| [Edge]      |    ?    | [![Blink][chrome.svg]][Blink]   |
| [Opera]     |    ✓    | [![Blink][chrome.svg]][Blink]   |
| [Safari]    |    ✗    | [![WebKit][safari.svg]][WebKit] |
| [Vivaldi]   |    ✓    | [![Blink][chrome.svg]][Blink]   |
| [Brave]     |    ✓    | [![Blink][chrome.svg]][Blink]   |

[Chrome]: https://google.com/chrome/
[Chrome Web Store]: https://chrome.google.com/webstore

[Firefox]: https://mozilla.org/firefox/
[Firefox Add-ons]: https://addons.mozilla.org

[Chrome]: https://google.com/chrome/
[Firefox]: https://mozilla.org/firefox/
[Edge]: https://microsoft.com/en-us/windows/microsoft-edge
[Opera]: https://opera.com
[Safari]: https://apple.com/safari/
[Vivaldi]: https://vivaldi.com
[Brave]: https://brave.com

[Blink]: https://chromium.org/blink
[Gecko]: https://developer.mozilla.org/en-US/docs/Mozilla/Gecko
[WebKit]: https://webkit.org

[chrome.svg]: https://developer.mozilla.org/static/browsers/chrome.b49946f7739f.svg
[firefox.svg]: https://developer.mozilla.org/static/browsers/firefox.1c9f202ae696.svg
[safari.svg]: https://developer.mozilla.org/static/browsers/safari.aca6ae03b671.svg

[Kakoune]: https://kakoune.org
[mpv]: https://mpv.io
[dmenu]: https://tools.suckless.org/dmenu/
[Zip]: http://infozip.sourceforge.net/Zip.html
[Inkscape]: https://inkscape.org

[Commands]: https://github.com/alexherbo2/chrome-commands
[Shell]: https://github.com/alexherbo2/chrome-shell
[chrome-dmenu]: https://github.com/alexherbo2/chrome-dmenu

[Chrome – Getting Started Tutorial]: https://developer.chrome.com/extensions/getstarted
[Firefox – Your first extension]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension

[Regular Expressions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

[Create a keyboard interface to the web]: https://alexherbo2.github.io/blog/chrome/create-a-keyboard-interface-to-the-web/
