function KrabbyExtension(krabby) {

  // Environment variables ─────────────────────────────────────────────────────

  switch (true) {
    case (typeof browser !== 'undefined'):
      krabby.env.PLATFORM = 'firefox'
      krabby.env.COMMANDS_EXTENSION_ID = 'commands@alexherbo2.github.com'
      krabby.env.SHELL_EXTENSION_ID = 'shell@alexherbo2.github.com'
      krabby.env.EDITOR_EXTENSION_ID = 'editor@alexherbo2.github.com'
      krabby.env.DMENU_EXTENSION_ID = 'dmenu@alexherbo2.github.com'
      break
    case (typeof chrome !== 'undefined'):
      krabby.env.PLATFORM = 'chrome'
      krabby.env.COMMANDS_EXTENSION_ID = 'cabmgmngameccclicfmcpffnbinnmopc'
      krabby.env.SHELL_EXTENSION_ID = 'ohgecdnlcckpfnhjepfdcdgcfgebkdgl'
      krabby.env.EDITOR_EXTENSION_ID = 'oaagifcpibmdpajhjfcdjliekffjcnnk'
      krabby.env.DMENU_EXTENSION_ID = 'gonendiemfggilnopogmkafgadobkoeh'
      break
  }

  // Extensions ────────────────────────────────────────────────────────────────

  krabby.extensions = {}

  // Commands
  krabby.extensions.commands = {}
  krabby.extensions.commands.port = chrome.runtime.connect(krabby.env.COMMANDS_EXTENSION_ID)
  krabby.extensions.commands.send = (command, ...arguments) => {
    krabby.extensions.commands.port.postMessage({ command, arguments })
  }

  // Shell
  krabby.extensions.shell = {}
  krabby.extensions.shell.port = chrome.runtime.connect(krabby.env.SHELL_EXTENSION_ID)
  krabby.extensions.shell.send = (command, ...arguments) => {
    krabby.extensions.shell.port.postMessage({ command, arguments })
  }

  krabby.extensions.shell.port.onMessage.addListener((response) => {
    switch (response.id) {
      case 'html-filter':
        krabby.commands.copyToClipboard(response.output, 'HTML selection filtered and copied')
        break
    }
  })

  // Editor
  krabby.extensions.editor = {}
  krabby.extensions.editor.port = chrome.runtime.connect(krabby.env.EDITOR_EXTENSION_ID)
  krabby.extensions.editor.send = (command, ...arguments) => {
    krabby.extensions.editor.port.postMessage({ command, arguments })
  }

  // dmenu
  krabby.extensions.dmenu = {}
  krabby.extensions.dmenu.port = chrome.runtime.connect(krabby.env.DMENU_EXTENSION_ID)
  krabby.extensions.dmenu.send = (command, ...arguments) => {
    krabby.extensions.dmenu.port.postMessage({ command, arguments })
  }

  krabby.extensions.commands.send('get-platform')
  krabby.extensions.commands.port.onMessage.addListener((response) => {
    switch (response.id) {
      case 'get-platform':
        switch (response.platform.os) {
          case 'linux':
          case 'openbsd':
            krabby.settings['opener'] = 'xdg-open'
            break
          case 'mac':
            krabby.settings['opener'] = 'open'
            break
        }
        break
    }
  })

  // Commands ──────────────────────────────────────────────────────────────────

  krabby.commands.openInNewTab = (selections, callback = (link) => link.href) => {
    for (const link of krabby.commands.getElements(selections)) {
      krabby.extensions.commands.send('new-tab', callback(link))
    }
  }

  krabby.commands.openInNewWindow = (selections, callback = (link) => link.href) => {
    for (const link of krabby.commands.getElements(selections)) {
      krabby.extensions.commands.send('new-window', callback(link))
    }
  }

  krabby.commands.download = (selections, callback = (link) => link.href) => {
    for (const link of krabby.commands.getElements(selections)) {
      krabby.extensions.commands.send('download', callback(link))
    }
  }

  krabby.commands.open = (selections, callback = (link) => link.href) => {
    for (const link of krabby.commands.getElements(selections)) {
      krabby.extensions.shell.send(krabby.settings['opener'], callback(link))
    }
  }

  krabby.commands.yankFilteredHTML = (selections, filter) => {
    const [command, ...arguments] = filter
    const input = krabby.commands.getElements(selections).map((element) => element.outerHTML).join('\n')
    krabby.extensions.shell.port.postMessage({
      id: 'html-filter',
      command,
      arguments,
      input
    })
  }

  krabby.commands.mpv = ({ selections, callback = (link) => link.href, reverse = false } = {}) => {
    const playlist = krabby.commands.getElements(selections).map(callback)
    if (reverse) {
      playlist.reverse()
    }
    krabby.extensions.shell.send('mpv', ...krabby.settings['mpv-config'], ...playlist)
  }

  krabby.commands.mpvResume = () => {
    const media = krabby.commands.player().media
    media.pause()
    krabby.extensions.shell.send('mpv', ...krabby.settings['mpv-config'], location.href, '-start', media.currentTime.toString())
  }

  // Mappings ──────────────────────────────────────────────────────────────────

  // External editor
  krabby.modes.modal.map('Text', ['Alt', 'KeyI'], () => krabby.extensions.editor.send('edit'), 'Open your favorite editor', 'External editor')

  // dmenu
  krabby.modes.modal.map('Command', ['KeyQ'], () => krabby.extensions.dmenu.send('tab-search'), 'Tab search', 'dmenu')
  krabby.modes.modal.map('Command', ['Shift', 'KeyQ'], () => krabby.extensions.dmenu.send('bring-tab'), 'Bring tab', 'dmenu')
  krabby.modes.modal.map('Command', ['Alt', 'KeyQ'], () => krabby.extensions.dmenu.send('open-bookmark'), 'Open bookmark', 'dmenu')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyQ'], () => krabby.extensions.dmenu.send('search-history'), 'Search history', 'dmenu')

  // Zoom
  krabby.modes.modal.map('Command', ['Shift', 'Equal'], () => krabby.extensions.commands.send('zoom-in'), 'Zoom in', 'Zoom')
  krabby.modes.modal.map('Command', ['Minus'], () => krabby.extensions.commands.send('zoom-out'), 'Zoom out', 'Zoom')
  krabby.modes.modal.map('Command', ['Equal'], () => krabby.extensions.commands.send('zoom-reset'), 'Reset to default zoom level', 'Zoom')

  // Create tabs
  krabby.modes.modal.map('Command', ['KeyT'], () => krabby.extensions.commands.send('new-tab'), 'New tab', 'Create tabs')
  krabby.modes.modal.map('Command', ['Alt', 'KeyT'], () => krabby.extensions.commands.send('new-tab-right'), 'New tab to the right', 'Create tabs')
  krabby.modes.modal.map('Command', ['Shift', 'KeyT'], () => krabby.extensions.commands.send('restore-tab'), 'Restore tab', 'Create tabs')
  krabby.modes.modal.map('Command', ['KeyB'], () => krabby.extensions.commands.send('duplicate-tab'), 'Duplicate tab', 'Create tabs')

  // Create windows
  krabby.modes.modal.map('Command', ['KeyN'], () => krabby.extensions.commands.send('new-window'), 'New window', 'Create windows')
  krabby.modes.modal.map('Command', ['Shift', 'KeyN'], () => krabby.extensions.commands.send('new-incognito-window'), 'New incognito window', 'Create windows')

  // Close tabs
  krabby.modes.modal.map('Command', ['KeyX'], () => krabby.extensions.commands.send('close-tab'), 'Close tab', 'Close tabs')
  krabby.modes.modal.map('Command', ['Shift', 'KeyX'], () => krabby.extensions.commands.send('close-other-tabs'), 'Close other tabs', 'Close tabs')
  krabby.modes.modal.map('Command', ['Alt', 'KeyX'], () => krabby.extensions.commands.send('close-right-tabs'), 'Close tabs to the right', 'Close tabs')

  // Refresh tabs
  krabby.modes.modal.map('Command', ['Alt', 'KeyR'], () => krabby.extensions.commands.send('reload-all-tabs'), 'Reload all tabs', 'Refresh tabs')

  // Switch tabs
  krabby.modes.modal.map('Page', ['Alt', 'KeyL'], () => krabby.extensions.commands.send('next-tab'), 'Next tab', 'Switch tabs')
  krabby.modes.modal.map('Page', ['Alt', 'KeyH'], () => krabby.extensions.commands.send('previous-tab'), 'Previous tab', 'Switch tabs')
  krabby.modes.modal.map('Page', ['Alt', 'Digit1'], () => krabby.extensions.commands.send('first-tab'), 'First tab', 'Switch tabs')
  krabby.modes.modal.map('Page', ['Alt', 'Digit0'], () => krabby.extensions.commands.send('last-tab'), 'Last tab', 'Switch tabs')

  // Move tabs
  krabby.modes.modal.map('Page', ['Alt', 'Shift', 'KeyL'], () => krabby.extensions.commands.send('move-tab-right'), 'Move tab right', 'Move tabs')
  krabby.modes.modal.map('Page', ['Alt', 'Shift', 'KeyH'], () => krabby.extensions.commands.send('move-tab-left'), 'Move tab left', 'Move tabs')
  krabby.modes.modal.map('Page', ['Alt', 'Shift', 'Digit1'], () => krabby.extensions.commands.send('move-tab-first'), 'Move tab first', 'Move tabs')
  krabby.modes.modal.map('Page', ['Alt', 'Shift', 'Digit0'], () => krabby.extensions.commands.send('move-tab-last'), 'Move tab last', 'Move tabs')

  // Detach tabs
  krabby.modes.modal.map('Command', ['KeyD'], () => krabby.extensions.commands.send('detach-tab'), 'Detach tab', 'Detach tabs')
  krabby.modes.modal.map('Command', ['Shift', 'KeyD'], () => krabby.extensions.commands.send('attach-tab'), 'Attach tab', 'Detach tabs')

  // Discard tabs
  krabby.modes.modal.map('Command', ['Shift', 'Escape'], () => krabby.extensions.commands.send('discard-tab'), 'Discard tab', 'Discard tabs')

  // Mute tabs
  krabby.modes.modal.map('Command', ['Alt', 'KeyM'], () => krabby.extensions.commands.send('mute-tab'), 'Mute tab', 'Mute tabs')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyM'], () => krabby.extensions.commands.send('mute-all-tabs'), 'Mute all tabs', 'Mute tabs')

  // Pin tabs
  krabby.modes.modal.map('Command', ['Alt', 'KeyP'], () => krabby.extensions.commands.send('pin-tab'), 'Pin tab', 'Pin tabs')

  // Open links
  krabby.modes.modal.map('Link', ['Control', 'Enter'], () => krabby.commands.openInNewTab(krabby.selections), 'Open link in new tab', 'Open links')
  krabby.modes.modal.map('Link', ['Shift', 'Enter'], () => krabby.commands.openInNewWindow(krabby.selections), 'Open link in new window', 'Open links')
  krabby.modes.modal.map('Link', ['Alt', 'Enter'], () => krabby.commands.download(krabby.selections), 'Download link', 'Open links')
  krabby.modes.modal.map('Image', ['Control', 'Enter'], () => krabby.commands.openInNewTab(krabby.selections, (selection) => selection.src), 'Open image in new tab', 'Open links')
  krabby.modes.modal.map('Image', ['Shift', 'Enter'], () => krabby.commands.openInNewWindow(krabby.selections, (selection) => selection.src), 'Open image in new window', 'Open links')
  krabby.modes.modal.map('Image', ['Alt', 'Enter'], () => krabby.commands.download(krabby.selections, (selection) => selection.src), 'Download image', 'Open links')

  // mpv
  krabby.modes.modal.map('Document', ['KeyM'], () => krabby.extensions.shell.send('mpv', ...krabby.settings['mpv-config'], location.href), 'Play with mpv', 'mpv')

  return krabby
}
