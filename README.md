# Configuration for [Chrome]

> Configuration example to [create a keyboard interface to the web].

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
