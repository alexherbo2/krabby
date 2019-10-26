# Configuration

## Files

- [`~/.config/krabby`](/share/krabby)
  - [`manifest.json`](/share/krabby/manifest.json): extension’s entry point.
  - [`config.js`](/share/krabby/config.js): contains the user configuration.
  - [`fetch`](/share/krabby/fetch): shell script to fetch plugins.
  - [`Makefile`](/share/krabby/Makefile): contains commands to build and update Krabby.
  - `packages`: contains files used by Krabby: [Modal], [Prompt], [Hint], [Selection], [Mouse], [Clipboard], [Scroll], [Player], [icons][Krabby icon] and [`krabby.js`](/src/krabby.js).
  - `extensions`: contains extensions used by Krabby: [Commands], [Shell] and [dmenu].  [Krabby] repository can be found here, to update the extension when you run `make update`.

Krabby’s default configuration is located in [`~/.config/krabby/packages/krabby.js`](/src/krabby.js).

## Mapping

Creating and removing mappings boils down to the following commands:

``` javascript
modal.map(context, keys, command, description)
```

``` javascript
modal.unmap(context, keys)
```

The **context** dictates in what context the mapping will be available:
**Command**, **Text**, **Link**, **Image**, **Video** or **Page**.

The **keys** represent a chord – a key sequence in which the keys are pressed at
the same time.  They are composed of a single [key code][KeyboardEvent.code] and
optional [modifiers].  For special keys, the list of key values can be found
[here][Key Values].

The **command** is the function to evaluate.

The **description** is the description of the command.

[Krabby]: https://github.com/alexherbo2/krabby
[Krabby icon]: https://iconfinder.com/icons/877852/kanto_krabby_pokemon_water_icon

[Modal]: https://github.com/alexherbo2/modal.js
[Prompt]: https://github.com/alexherbo2/prompt.js
[Hint]: https://github.com/alexherbo2/hint.js
[Selection]: https://github.com/alexherbo2/selection.js
[Mouse]: https://github.com/alexherbo2/mouse.js
[Clipboard]: https://github.com/alexherbo2/clipboard.js
[Scroll]: https://github.com/alexherbo2/scroll.js
[Player]: https://github.com/alexherbo2/player.js

[Commands]: https://github.com/alexherbo2/chrome-commands
[Shell]: https://github.com/alexherbo2/chrome-shell
[dmenu]: https://github.com/alexherbo2/chrome-dmenu

[KeyboardEvent.code]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
[Key Values]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
[Modifiers]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values#Modifier_keys
