# Extending functionalities

## Extensions

Example with [dmenu for Chrome].

`~/.config/krabby/config.js`

``` javascript
// Environment variables ───────────────────────────────────────────────────────

switch (true) {
  case (typeof browser !== 'undefined'):
    var PLATFORM = 'firefox'
    var DMENU_EXTENSION_ID = 'dmenu@alexherbo2.github.com'
    break
  case (typeof chrome !== 'undefined'):
    var PLATFORM = 'chrome'
    var DMENU_EXTENSION_ID = 'gonendiemfggilnopogmkafgadobkoeh'
    break
}

// Extensions ──────────────────────────────────────────────────────────────────

// dmenu
const dmenu = {}
dmenu.port = chrome.runtime.connect(DMENU_EXTENSION_ID)
dmenu.send = (command, ...arguments) => {
  dmenu.port.postMessage({ command, arguments })
}

// Mappings ────────────────────────────────────────────────────────────────────

// Tab search
modal.map('Command', ['KeyQ'], () => dmenu.send('tab-search'), 'Tab search with dmenu')
```

## Scripts

Example with [Launchlet for Krabby] to run commands by name.

`~/.config/krabby/plugins/launchlet.js`

``` javascript
const launchlet = () => {
  const LCHOptionRecipes = Object.entries(modal.context.commands).map(([keyChord, { command, description }]) => {
    const key = modal.keyValues(JSON.parse(keyChord)).join('+')
    const LCHRecipeName = `${key}: ${description}`
    return {
      LCHRecipeName,
      LCHRecipeCallback: command
    }
  })
  Launchlet.LCHSingletonCreate({
    LCHOptionRecipes,
    LCHOptionMode: Launchlet.LCHModeCommit
  })
}

modal.map('Page', ['Alt', 'F1'], () => launchlet(), 'Run Launchlet')
```

Update your [`manifest.json`](/share/krabby/manifest.json) and [`fetch`](/share/krabby/fetch) files.

`~/.config/krabby/fetch`

``` sh
fetch https://launchlet.dev/launchlet.js
fetch https://launchlet.dev/launchlet.css
```

`~/.config/krabby/manifest.json`

``` json
{
  "content_scripts": [
    {
      "js": [
        "packages/launchlet.js",
        "plugins/launchlet.js"
      ],
      "css": [
        "packages/launchlet.css"
      ]
    }
  ]
}
```

Run the following in your terminal.

``` sh
cd ~/.config/krabby
make
```

[dmenu for Chrome]: https://github.com/alexherbo2/chrome-dmenu
[Launchlet for Krabby]: https://github.com/alexherbo2/krabby-launchlet
