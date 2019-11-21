# Interfacing Krabby with external programs

###### [Shell]

## Basic interaction

`~/.config/krabby/config.js`

``` javascript
const { extensions, modes, commands } = krabby
const { shell } = extensions
const { modal } = modes

shell.port.onMessage.addListener((response) => {
  switch (response.id) {
    case 'ping-pong':
      console.log(response.output)
      break
  }
})

commands.ping = () => {
  shell.port.postMessage({
    id: 'ping-pong',
    command: 'echo',
    arguments: ['Pong']
  })
}

modal.map('Command', ['KeyP'], () => commands.ping(), 'Ping', 'Ping-pong')
```

## Shell

`~/.config/krabby/config.js`

``` javascript
commands.ping = () => {
  shell.port.postMessage({
    id: 'ping-pong',
    shell: true,
    command: 'echo Pong'
  })
}
```

## Piping

`~/.config/krabby/config.js`

``` javascript
commands.ping = () => {
  shell.port.postMessage({
    id: 'ping-pong',
    command: 'cat',
    input: 'Pong'
  })
}
```

[Shell]: https://github.com/alexherbo2/chrome-shell
