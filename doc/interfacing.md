# Interfacing Krabby with external programs

See the following examples:

- [chrome-shell](https://github.com/alexherbo2/chrome-shell)
- [chrome-editor](https://github.com/alexherbo2/chrome-editor)
- [chrome-dmenu](https://github.com/alexherbo2/chrome-dmenu)

`~/.config/krabby/config.js`

``` javascript
const { extensions, modes, commands } = krabby
const { shell } = extensions
const { modal } = modes

// Ping-pong
commands.ping = () => {
  shell.port.postMessage({
    id: 'ping-pong',
    command: 'echo',
    arguments: ['Ping']
  })
  shell.port.onMessage.addListener((response) => {
    switch (response.id) {
      case 'ping-pong':
        console.log(response.output, 'Pong')
        break
    }
  })
}

// Mappings
modal.map('Command', ['F2'], () => commands.ping(), 'Ping', 'Ping-pong')
```

See [chrome-shell] for a complete reference.

[chrome-shell]: https://github.com/alexherbo2/chrome-shell
