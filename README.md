# [Krabby]

<img src="https://www.iconfinder.com/icons/877852/download/svg/512" height="168" align="right">

[![IRC](https://img.shields.io/badge/IRC-%23krabby-blue)](https://webchat.freenode.net/#krabby)
[![Plugins](https://img.shields.io/badge/Plugins-%23krabby%20%23plugin-green)](https://github.com/search?q=topic:krabby+topic:plugin)

###### [Installation](#installation) | [Configuration](doc/configuration.md) | [Documentation](doc) | [Browser compatibility](#browser-compatibility) | [Contributing](CONTRIBUTING)

> Krabby is a [WebExtension] for keyboard-based navigation, inspired by [Kakoune].
>
> The main differences with existing extensions are:
> multiple selections,
> keyboard layout agnostic,
> SOV ([subject–object–verb]) constructs and
> simple interaction with external programs.
> It is also quite usable with the mouse.

## TL;DR

**WebExtension** — **Keyboard interface** — **Subject–object–verb order** — **Multiple selections** — **Kakoune-inspired**

Run the following in your terminal, then follow the onscreen instructions.

``` sh
git clone https://github.com/alexherbo2/krabby
cd krabby
make install [static=no]
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

- [Subject–object–verb] order.  Learn more at [Differences with Vi(m)][A linguistic twist].
- Keyboard layout agnostic.  Maps to physical keys, but displays with the [US layout][QWERTY].
- Multiple selections as a central way of interacting
- Powerful selection manipulation primitives
- Link hints
- External editor support.  Open your favorite editor on text inputs.
- Tab search
- Contextual commands
- Contextual help
- Simple interaction with external programs
- Usable with the mouse.  You can for example create a selection by grabbing a
link with the mouse and <kbd>s</kbd> to create the selection.  Or create multiple
selections by clicking on hints with <kbd>F</kbd>.
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

<details>

<summary>Copy selection with Pandoc</summary>

[![Copy selection with Pandoc](https://img.youtube.com/vi_webp/gmx3eEm6L3M/maxresdefault.webp)](https://youtu.be/gmx3eEm6L3M)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>s</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (4 times)
- <kbd>Y</kbd> → Copy selection, using an HTML filter

</details>

<details>

<summary>Copy multiple links</summary>

[![Copy multiple links](https://img.youtube.com/vi_webp/rRGmuJhopJg/maxresdefault.webp)](https://youtu.be/rRGmuJhopJg)

**Commands**

- <kbd>f</kbd> → Focus link
  - Input: <kbd>s</kbd>
- <kbd>s</kbd> → Select active element
- <kbd>Alt</kbd> + <kbd>a</kbd> → Select parent elements (3 times)
- <kbd>Alt</kbd> + <kbd>i</kbd> → Select child elements
- <kbd>Alt</kbd> + <kbd>]</kbd> → Select last child elements
- <kbd>Alt</kbd> + <kbd>(</kbd> → Select previous sibling elements
- <kbd>Alt</kbd> + <kbd>I</kbd> → Select links
- <kbd>y</kbd> → Copy link address
- <kbd>Y</kbd> → Copy link address and text

</details>

## Dependencies

- [Crystal]
- [Docker] (for static builds)
- [jq]
- [mpv] (Optional, for playing videos)
- [Rofi] (Optional, for tab search, [dmenu] replacement)
- [Pandoc] (Optional, for HTML filtering)
- [Zip] (Zip is used to package the extension)

### Extensions

- [Commands] (Chrome API to perform browser actions)
- [Shell] (Chrome API to execute external commands)
- [Editor] (Open an external editor to edit text inputs)
- [dmenu][chrome-dmenu] (Tab search with [dmenu])

## Installation

Run the following in your terminal, then follow the onscreen instructions.

``` sh
make install [static=no]
```

## Browser compatibility

| Web browser | Support |             Engine              |                                 Comments                                 |
| ----------- |:-------:|:-------------------------------:| ------------------------------------------------------------------------ |
| [Chrome]    |    ✓    | [![Blink][chrome.svg]][Blink]   |                                                                          |
| [Chromium]  |    ✓    | [![Blink][chrome.svg]][Blink]   |                                                                          |
| [Firefox]   |    ✓    | [![Gecko][firefox.svg]][Gecko]  | [Only developer or unbranded version][Firefox – Extension Signing – FAQ] |
| [Edge]      |    ?    | [![Blink][chrome.svg]][Blink]   |                                                                          |
| [Opera]     |    ✓    | [![Blink][chrome.svg]][Blink]   |                                                                          |
| [Safari]    |    ✗    | [![WebKit][safari.svg]][WebKit] |                                                                          |
| [Vivaldi]   |    ✓    | [![Blink][chrome.svg]][Blink]   |                                                                          |
| [Brave]     |    ✓    | [![Blink][chrome.svg]][Blink]   |                                                                          |

## Credits

- [Kakoune] ([@mawww]) for [ideas][Why Kakoune] and [selection.cc].
- [Saka Key] ([@eejdoowad]) was a reference, for implementation and its code quality.
- [@ul], for his advice and proofreading, especially in the early stages.
- [@GeoGavilanes] for the [Krabby icon].
- [@occivink], for his work on [phantom selections][kakoune-phantom-selection], from which the “save and restore selections” feature is inspired.
- [mpv] and [Kakoune] for their website, from which [Krabby] is inspired.
- [@AdamWagner] for his work to unify scrolling mechanisms.

## References

- [Create a keyboard interface to the web]

[Krabby]: https://krabby.netlify.com
[Live demo]: https://krabby.netlify.com#live-demo
[Krabby icon]: https://iconfinder.com/icons/877852/kanto_krabby_pokemon_water_icon

[A linguistic twist]: https://github.com/alexherbo2/krabby/blob/master/doc/differences-with-vim.md#a-linguistic-twist

[WebExtension]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
[QWERTY]: https://en.wikipedia.org/wiki/QWERTY
[Subject–object–verb]: https://en.wikipedia.org/wiki/Subject–object–verb

[Chrome]: https://google.com/chrome/
[Chrome Web Store]: https://chrome.google.com/webstore

[Firefox]: https://mozilla.org/firefox/
[Firefox Add-ons]: https://addons.mozilla.org
[Firefox – Extension Signing – FAQ]: https://wiki.mozilla.org/Add-ons/Extension_Signing#FAQ

[Chrome]: https://google.com/chrome/
[Chromium]: https://chromium.org
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
[Docker]: https://docker.com
[jq]: https://stedolan.github.io/jq/
[mpv]: https://mpv.io
[dmenu]: https://tools.suckless.org/dmenu/
[Rofi]: https://github.com/davatorium/rofi
[Pandoc]: https://pandoc.org
[Zip]: http://infozip.sourceforge.net/Zip.html

[Commands]: https://github.com/alexherbo2/chrome-commands
[Shell]: https://github.com/alexherbo2/chrome-shell
[Editor]: https://github.com/alexherbo2/chrome-editor
[chrome-dmenu]: https://github.com/alexherbo2/chrome-dmenu

[Kakoune]: https://kakoune.org
[Why Kakoune]: https://kakoune.org/why-kakoune/why-kakoune.html
[selection.cc]: https://github.com/mawww/kakoune/blob/master/src/selection.cc
[kakoune-phantom-selection]: https://github.com/occivink/kakoune-phantom-selection

[Saka Key]: https://key.saka.io

[@mawww]: https://github.com/mawww
[@eejdoowad]: https://github.com/eejdoowad
[@ul]: https://github.com/ul
[@GeoGavilanes]: https://iconfinder.com/GeoGavilanes
[@occivink]: https://github.com/occivink
[@AdamWagner]: https://github.com/AdamWagner

[Regular Expressions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

[Create a keyboard interface to the web]: https://alexherbo2.github.io/blog/chrome/create-a-keyboard-interface-to-the-web/
