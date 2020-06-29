# Extending functionalities

**Table of contents**

- [Cross-extension messaging](#cross-extension-messaging)
- [Plugins](#plugins)

## Cross-extension messaging

See the following examples:

- [webextension-commands](https://github.com/alexherbo2/webextension-commands)
- [webextension-shell](https://github.com/alexherbo2/webextension-shell)
- [webextension-editor](https://github.com/alexherbo2/webextension-editor)
- [webextension-dmenu](https://github.com/alexherbo2/webextension-dmenu)

`~/.config/krabby/config.js`

``` javascript
const { extensions, modes } = krabby
const { modal } = modes

// Your awesome extension
extensions.your_awesome_extension = {}
extensions.your_awesome_extension.port = chrome.runtime.connect(your_awesome_extension_id)
extensions.your_awesome_extension.send = (command, ...arguments) => {
  extensions.your_awesome_extension.port.postMessage({ command, arguments })
}

// Mappings
modal.map('Command', ['F2'], () => extensions.your_awesome_extension.send('something'), 'Call something from your awesome extension', 'Your awesome extension')
```

See [Cross-extension messaging] for a complete reference.

[Cross-extension messaging]: https://developer.chrome.com/extensions/messaging#external

## Plugins

See the following examples:

- [krabby-launchlet](https://github.com/alexherbo2/krabby-launchlet)
- [krabby-selection](https://github.com/alexherbo2/krabby-selection)

Search the following topics [`#krabby #plugin`] for other plugins.

[`#krabby #plugin`]: https://github.com/search?q=topic:krabby+topic:plugin
