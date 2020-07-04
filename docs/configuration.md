# Configuration

**Table of contents**

- [Files](#files)
- [Mapping](#mapping)
- [Keyboard layout](#keyboard-layout)
- [Hint appearance](#hint-appearance)
- [Tab search](#tab-search)
- [External editor](#external-editor)
- [mpv](#mpv)
- [HTML filter](#html-filter)
- [Plumbing](#plumbing)
- [Show keys](#show-keys)

## Files

- [`~/.config/krabby`](/share/krabby)
  - [`manifest`](/share/krabby/manifest): extension’s entry point.
  - [`config.js`](/share/krabby/config.js): contains the user configuration.
  - [`fetch`](/share/krabby/fetch): shell script to fetch plugins.
  - [`Makefile`](/share/krabby/Makefile): contains commands to build and update Krabby.
  - [`.gitignore`](/share/krabby/.gitignore): files to ignore.
  - `packages`: contains files used by Krabby.
    - [modal.js]
    - [mouse-selection.js]
    - [prompt.js]
    - [hint.js]
    - [mark.js]
    - [selection.js]
    - [mouse.js]
    - [clipboard.js]
    - [scroll.js]
    - [player.js]
    - [icons][Krabby icon]
    - [`krabby`](/src/krabby)
  - `extensions`: contains extensions used by Krabby.
    - [webextension-commands]
    - [webextension-shell]
    - [webextension-editor]
    - [webextension-dmenu]
    - [Krabby] (self-update)
- [`~/.local/bin`](/bin): contains executables used by Krabby.
  - [`plumb`](/bin/plumb)

Krabby’s default configuration is located in [`~/.config/krabby/packages/krabby`](/src/krabby).

[Krabby]: https://github.com/alexherbo2/krabby
[Krabby icon]: https://iconfinder.com/icons/877852/kanto_krabby_pokemon_water_icon

[modal.js]: https://github.com/alexherbo2/modal.js
[mouse-selection.js]: https://simonwep.github.io/selection/
[prompt.js]: https://github.com/alexherbo2/prompt.js
[hint.js]: https://github.com/alexherbo2/hint.js
[mark.js]: https://github.com/alexherbo2/mark.js
[selection.js]: https://github.com/alexherbo2/selection.js
[mouse.js]: https://github.com/alexherbo2/mouse.js
[clipboard.js]: https://github.com/alexherbo2/clipboard.js
[scroll.js]: https://github.com/alexherbo2/scroll.js
[player.js]: https://github.com/alexherbo2/player.js

[webextension-commands]: https://github.com/alexherbo2/webextension-commands
[webextension-shell]: https://github.com/alexherbo2/webextension-shell
[webextension-editor]: https://github.com/alexherbo2/webextension-editor
[webextension-dmenu]: https://github.com/alexherbo2/webextension-dmenu

## Mapping

`~/.config/krabby/config.js`

``` javascript
const { modes } = krabby
const { modal } = modes

modal.map('Command', ['F2'], (event) => console.log(krabby.settings), 'Display settings in the console', 'Help')
```

You are encouraged to read the default configuration.

See [modal.js] for a complete reference.

## Keyboard layout

Use the [home row] and display keys with the [US layout][QWERTY]:

`~/.config/krabby/config.js`

``` javascript
const { modes } = krabby
const { modal } = modes

modal.keyMap = {
  Backquote: { key: '`', shiftKey: '~' }, Digit1: { key: '1', shiftKey: '!' }, Digit2: { key: '2', shiftKey: '@' }, Digit3: { key: '3', shiftKey: '#' }, Digit4: { key: '4', shiftKey: '$' }, Digit5: { key: '5', shiftKey: '%' }, Digit6: { key: '6', shiftKey: '^' }, Digit7: { key: '7', shiftKey: '&' }, Digit8: { key: '8', shiftKey: '*' }, Digit9: { key: '9', shiftKey: '(' }, Digit0: { key: '0', shiftKey: ')' }, Minus: { key: '-', shiftKey: '_' }, Equal: { key: '=', shiftKey: '+' },
  KeyQ: { key: 'q', shiftKey: 'Q' }, KeyW: { key: 'w', shiftKey: 'W' }, KeyE: { key: 'e', shiftKey: 'E' }, KeyR: { key: 'r', shiftKey: 'R' }, KeyT: { key: 't', shiftKey: 'T' }, KeyY: { key: 'y', shiftKey: 'Y' }, KeyU: { key: 'u', shiftKey: 'U' }, KeyI: { key: 'i', shiftKey: 'I' }, KeyO: { key: 'o', shiftKey: 'O' }, KeyP: { key: 'p', shiftKey: 'P' }, BracketLeft: { key: '[', shiftKey: '{' }, BracketRight: { key: ']', shiftKey: '}' }, Backslash: { key: '\\', shiftKey: '|' },
  KeyA: { key: 'a', shiftKey: 'A' }, KeyS: { key: 's', shiftKey: 'S' }, KeyD: { key: 'd', shiftKey: 'D' }, KeyF: { key: 'f', shiftKey: 'F' }, KeyG: { key: 'g', shiftKey: 'G' }, KeyH: { key: 'h', shiftKey: 'H' }, KeyJ: { key: 'j', shiftKey: 'J' }, KeyK: { key: 'k', shiftKey: 'K' }, KeyL: { key: 'l', shiftKey: 'L' }, Semicolon: { key: ';', shiftKey: ':' }, Quote: { key: "'", shiftKey: '"' },
  KeyZ: { key: 'z', shiftKey: 'Z' }, KeyX: { key: 'x', shiftKey: 'X' }, KeyC: { key: 'c', shiftKey: 'C' }, KeyV: { key: 'v', shiftKey: 'V' }, KeyB: { key: 'b', shiftKey: 'B' }, KeyN: { key: 'n', shiftKey: 'N' }, KeyM: { key: 'm', shiftKey: 'M' }, Comma: { key: ',', shiftKey: '<' }, Period: { key: '.', shiftKey: '>' }, Slash: { key: '/', shiftKey: '?' }
}

Hint.KEY_MAP = () => ({
  Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5', Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0',
  KeyQ: 'q', KeyW: 'w', KeyE: 'e', KeyR: 'r', KeyT: 't', KeyY: 'y', KeyU: 'u', KeyI: 'i', KeyO: 'o', KeyP: 'p',
  KeyA: 'a', KeyS: 's', KeyD: 'd', KeyF: 'f', KeyG: 'g', KeyH: 'h', KeyJ: 'j', KeyK: 'k', KeyL: 'l',
  KeyZ: 'z', KeyX: 'x', KeyC: 'c', KeyV: 'v', KeyB: 'b', KeyN: 'n', KeyM: 'm'
})

Hint.keys = () => (
  ['KeyA', 'KeyJ', 'KeyS', 'KeyK', 'KeyD', 'KeyL', 'KeyG', 'KeyH', 'KeyE', 'KeyW', 'KeyO', 'KeyR', 'KeyU', 'KeyV', 'KeyN', 'KeyC', 'KeyM']
)
```

[QWERTY]: https://en.wikipedia.org/wiki/QWERTY
[Home row]: https://en.wikipedia.org/wiki/Touch_typing#Home_row

See [modal.js] and [hint.js] for a complete reference.

## Hint appearance

`~/.config/krabby/config.js`

``` javascript
const { settings } = krabby

settings['hint-style'] = {
  textColor: 'royalblue',
  activeCharacterTextColor: 'lightsteelblue',
  backgroundColorStart: 'white',
  backgroundColorEnd: 'ghostwhite',
  borderColor: 'ghostwhite'
}
```

See [hint.js] for a complete reference.

## Tab search

Change the [dmenu] command to search with [fzf] and [Alacritty]:

`~/.config/krabby/config.js`

``` javascript
const { extensions } = krabby
const { dmenu } = extensions

dmenu.send('set', {
  dmenu: {
    command: 'sh',
    arguments: [
      '-c',
      `
        # Create IO files
        state=$(mktemp -d)
        input=$state/input
        output=$state/output
        trap 'rm -Rf "$state"' EXIT
        # Get input from /dev/stdin
        cat > "$input"
        # Run fzf with Alacritty
        alacritty --class 'Alacritty · Floating' --command sh -c 'fzf < "$1" > "$2"' -- "$input" "$output"
        # Write output to /dev/stdout
        cat "$output"
        # Exit code
        if test ! -s "$output"; then
          exit 1
        fi
      `
    ]
  }
})
```

[dmenu]: https://tools.suckless.org/dmenu/
[fzf]: https://github.com/junegunn/fzf
[Alacritty]: https://github.com/alacritty/alacritty

See [webextension-dmenu] for a complete reference.

## External editor

Open [Kakoune] in [Alacritty]:

`~/.config/krabby/config.js`

``` javascript
const { extensions } = krabby
const { editor } = extensions

editor.send('set', {
  editor: `alacritty --class 'Alacritty · Floating' --command kak "$file" -e "select $anchor_line.$anchor_column,$cursor_line.$cursor_column"`
})
```

[Kakoune]: https://kakoune.org
[Alacritty]: https://github.com/alacritty/alacritty

See [webextension-editor] for a complete reference.

## mpv

`~/.config/krabby/config.js`

``` javascript
const { settings } = krabby

settings['mpv-config'] = ['-no-config', '-no-terminal']

settings['mpv-environment'] = {
  MPV_HOME: '~/.mpv'
}
```

## HTML filter

`~/.config/krabby/config.js`

``` javascript
const { settings } = krabby

settings['html-filter'] = ['pandoc', '--from', 'html', '--to', 'asciidoc']
```

## Plumbing

Change the [dmenu] command to validate with [fzf] and [Alacritty]:

``` sh
export DMENU=$(cat <<'EOF'
  # Create IO files
  state=$(mktemp -d)
  input=$state/input
  output=$state/output
  trap 'rm -Rf "$state"' EXIT
  # Get input from /dev/stdin
  cat > "$input"
  # Run fzf with Alacritty
  alacritty --class 'Alacritty · Floating' --command sh -c 'fzf < "$1" > "$2"' -- "$input" "$output"
  # Write output to /dev/stdout
  cat "$output"
  # Exit code
  if test ! -s "$output"; then
    exit 1
  fi
EOF
)
```

[dmenu]: https://tools.suckless.org/dmenu/
[fzf]: https://github.com/junegunn/fzf
[Alacritty]: https://github.com/alacritty/alacritty

Change the clipboard copy and paste commands:

``` sh
export CLIPBOARD_COPY=wl-copy
export CLIPBOARD_PASTE=wl-paste
```

See the [`plumb`](/bin/plumb) script for a complete reference.

## Show keys

`~/.config/krabby/config.js`

``` javascript
const { extensions, modes } = krabby
const { commands } = extensions
const { modal } = modes

// Show keys for screencasts
const showKeys = () => {
  modal.on('command', ({ keyChord, description, label }) => {
    const keys = modal.keyValues(keyChord)
    const key = keys.join('-')
    commands.send('notify', 'show-keys', {
      title: label,
      message: `${key} ⇒ ${description}`
    })
  })
  // Show native commands
  modal.on('default', ({ metaKey, altKey, ctrlKey, shiftKey, code }) => {
    const keyChord = { metaKey, altKey, ctrlKey, shiftKey, code }
    const keys = modal.keyValues(keyChord)
    const key = keys.join('-')
    commands.send('notify', 'show-keys', {
      title: 'Native',
      message: key
    })
  })
}

// Enable show-keys notifications
// showKeys()
```
