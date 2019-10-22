# Krabby

<img src="https://www.iconfinder.com/icons/877852/download/svg/512" height="168" align="right">

[![IRC](https://img.shields.io/badge/IRC-%23krabby-blue)](https://webchat.freenode.net/#krabby)

###### [Installation](#installation) | [Configuration](src/krabby.js) | [Documentation](doc) | [Browser compatibility](#browser-compatibility) | [Contributing](CONTRIBUTING)

> A keyboard interface to the web, heavily inspired by [Kakoune].

## TL;DR

**WebExtension** — **Keyboard interface** — **Subject–object–verb order** — **Multiple selections** — **Kakoune-inspired**

Run the following in your terminal, then follow the onscreen instructions.

``` sh
git clone https://github.com/alexherbo2/krabby
cd krabby
make install
```

After installing, try to accomplish the following examples.

<details>

<summary>Opening links in a paragraph</summary>

Navigate to <https://tuppervim.org> and type:

```
f{hint}s[alt+a][alt+I][ctrl+enter][alt+x]
```

**Explanation**

- <kbd>f</kbd> enters hint mode,
- `{hint}` is a placeholder for you to select a link,
- <kbd>s</kbd> creates a selection out of the active element,
- <kbd>Alt</kbd> + <kbd>a</kbd> expands the region,
- <kbd>Alt</kbd> + <kbd>I</kbd> selects all links,
- <kbd>Control</kbd> + <kbd>Enter</kbd> opens selected links in the background.
- Optionally, <kbd>Alt</kbd> + <kbd>x</kbd> will undo the operation (closing right tabs).

</details>

<details>

<summary>Play videos with mpv</summary>

Navigate to <https://youtube.com/results?search_query=Berserk+AMV> and type:

```
F{hint}{hint}<page-down>{hint}<escape>m
```

**Explanation**

- <kbd>F</kbd> enters hint mode (lock),
- `{hint}` is a placeholder for you to select 2 links,
- <kbd>Page Down</kbd> scrolls one page down,
- `{hint}` is a placeholder for you to select another link,
- <kbd>Escape</kbd> leaves hint mode.
- Finally, <kbd>m</kbd> opens the selection with [mpv].

</details>

If you want to play around without installing, a live demo is available [here][Live demo].

## Features

- [Subject–object–verb] order
- Multiple selections as a central way of interacting
- Powerful selection manipulation primitives
- Link hints
- Tab search
- Contextual commands
- Contextual help
- Simple interaction with external programs
- Limited scope.  Krabby is not [Vim], nor [Kakoune].  Krabby is trying to be a
navigation tool and some concepts from code editors don’t translate well.  For
example, there is no concept of mode in Krabby, but a system of contexts.
- Composability.  Composability is better than extensibility.  Krabby tries hard
to provide features that interact well with each other.  For example, <kbd>f</kbd>
and <kbd>y</kbd> are two building blocks to focus a link and yank its URL.  Depending
on the context, <kbd>y</kbd> will yank the page or a link URL.
- Modular (think [Emacs]).  Krabby is divided into multiple small projects.  At
its core Krabby just holds the configuration and grabs its functionalities from
other projects.
- [Chrome] and [Firefox] support.  It has also been tested on [Opera], [Vivaldi]
and [Brave].

## Demos

<details>

<summary>Download 3-gatsu no Lion episodes from HorribleSubs</summary>

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

</details>

<details>

<summary>Extract from Wikipedia the list of cities and towns in Russia</summary>

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

</details>

<details>

<summary>Quickly move around a document with no table of contents</summary>

[![Quickly move around a document with no table of contents](https://img.youtube.com/vi_webp/gp4_6VGXkOk/maxresdefault.webp)](https://youtu.be/gp4_6VGXkOk)

**Commands**

- <kbd>%</kbd> → Select document
- <kbd>S</kbd> → Select elements that match the specified group of selectors
  - Input: `h1, h2, h3`
- <kbd>(</kbd> → Focus previous selection

</details>

<details>

<summary>Tab search with dmenu</summary>

[![Tab search with dmenu](https://img.youtube.com/vi_webp/tgrmss3u2aE/maxresdefault.webp)](https://youtu.be/tgrmss3u2aE)

**Commands**

- <kbd>q</kbd> → Tab search with [dmenu]

</details>

<details>

<summary>Playing videos in picture-in-picture mode</summary>

[![Playing videos in picture-in-picture mode](https://img.youtube.com/vi_webp/zgSx1AE6pig/maxresdefault.webp)](https://youtu.be/zgSx1AE6pig)

**Commands**

- <kbd>p</kbd> → Toggle picture-in-picture mode

</details>

<details>

<summary>Opening links in a paragraph</summary>

[![Opening links in a paragraph](https://img.youtube.com/vi_webp/v2Jvk1rhIlc/maxresdefault.webp)](https://youtu.be/v2Jvk1rhIlc)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>e</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>Control</kbd> + <kbd>Enter</kbd> → Open link in new tab

</details>

<details>

<summary>Play videos with mpv</summary>

[![Play videos with mpv](https://img.youtube.com/vi_webp/gYTi-eXuWdI/maxresdefault.webp)](https://youtu.be/gYTi-eXuWdI)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>a</kbd>, <kbd>w</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (3 times)
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>Alt</kbd> + <kbd>m</kbd> → Play with [mpv] in reverse order

</details>

## Dependencies

- [Crystal]
- [jq]
- [mpv]
- [Rofi] ([dmenu] replacement)
- [Zip] (Zip is used to package the extension)

### Extensions

- [Commands] (Chrome API to perform browser actions)
- [Shell] (Chrome API to execute external commands)
- [dmenu][chrome-dmenu] (Tab search with [dmenu])

## Installation

Run the following in your terminal, then follow the onscreen instructions.

``` sh
make install
```

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

## Credits

- [Kakoune] ([@mawww]) for [ideas][Why Kakoune] and [selection.cc].
- [Saka Key] ([@eejdoowad]) was a reference, for implementation and its code quality.
- [@ul], for his advice and proofreading, especially in the early stages.
- [@GeoGavilanes] for the [Krabby icon].

## References

- [Create a keyboard interface to the web]

[Krabby icon]: https://iconfinder.com/icons/877852/kanto_krabby_pokemon_water_icon

[Subject–object–verb]: https://en.wikipedia.org/wiki/Subject–object–verb

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
[Vim]: https://vim.org
[Emacs]: https://gnu.org/software/emacs/
[Crystal]: https://crystal-lang.org
[jq]: https://stedolan.github.io/jq/
[mpv]: https://mpv.io
[dmenu]: https://tools.suckless.org/dmenu/
[Rofi]: https://github.com/davatorium/rofi
[Zip]: http://infozip.sourceforge.net/Zip.html

[Commands]: https://github.com/alexherbo2/chrome-commands
[Shell]: https://github.com/alexherbo2/chrome-shell
[chrome-dmenu]: https://github.com/alexherbo2/chrome-dmenu

[Kakoune]: https://kakoune.org
[Why Kakoune]: https://kakoune.org/why-kakoune/why-kakoune.html
[selection.cc]: https://github.com/mawww/kakoune/blob/master/src/selection.cc

[Saka Key]: https://key.saka.io

[@mawww]: https://github.com/mawww
[@eejdoowad]: https://github.com/eejdoowad
[@ul]: https://github.com/ul
[@GeoGavilanes]: https://iconfinder.com/GeoGavilanes

[Regular Expressions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

[Create a keyboard interface to the web]: https://alexherbo2.github.io/blog/chrome/create-a-keyboard-interface-to-the-web/
[Live demo]: https://alexherbo2.github.io/blog/chrome/create-a-keyboard-interface-to-the-web#try-it
