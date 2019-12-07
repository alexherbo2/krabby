function Krabby({ dormant = true } = {}) {

  const krabby = {}

  krabby.enabled = false
  krabby.mode = undefined
  krabby.modeName = ''

  // Environment variables ─────────────────────────────────────────────────────

  krabby.env = {}

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

  krabby.env.EDITOR = undefined
  krabby.env.HTML_FILTER = 'pandoc --from html --to markdown'

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
            krabby.env.OPENER = 'xdg-open'
            break
          case 'mac':
            krabby.env.OPENER = 'open'
            break
        }
        break
    }
  })

  // Status line ───────────────────────────────────────────────────────────────

  krabby.statusLine = {}
  krabby.statusLine.update = () => {
    const atoms = []
    // Enabled
    if (krabby.enabled) {
      atoms.push('🦀')
    } else {
      atoms.push('⏾')
    }
    // Mode
    atoms.push(krabby.modeName)
    // Selections
    switch (krabby.selections.length) {
      case 0:
        break
      case 1:
        atoms.push('(1)')
        break
      default:
        atoms.push(`(${krabby.selections.main + 1}/${krabby.selections.length})`)
    }
    const statusLine = atoms.join(' ')
    krabby.modes.modal.notify({ id: 'status-line', message: statusLine })
  }

  // Modes ─────────────────────────────────────────────────────────────────────

  krabby.modes = {}

  // Modal
  krabby.modes.modal = new Modal('Modal')
  krabby.modes.modal.activeElement = () => {
    return krabby.selections.length
      ? krabby.selections.mainSelection
      : Modal.getDeepActiveElement()
  }
  krabby.modes.modal.filter('Gmail', () => location.hostname === 'mail.google.com')
  krabby.modes.modal.enable('Gmail', 'Video', 'Image', 'Link', 'Document', 'Text', 'Command')
  krabby.modes.modal.on('start', () => {
    krabby.enabled = true
    krabby.mode = krabby.modes.modal
    krabby.modeName = krabby.modes.modal.context.name
    krabby.statusLine.update()
  })
  krabby.modes.modal.on('context-change', (context) => {
    krabby.modeName = context.name
    krabby.statusLine.update()
  })

  // Prompt
  krabby.modes.prompt = new Prompt
  krabby.modes.prompt.on('open', () => {
    krabby.mode = krabby.modes.prompt
    krabby.modeName = 'Prompt'
    krabby.modes.modal.unlisten()
    krabby.statusLine.update()
  })
  krabby.modes.prompt.on('close', () => krabby.modes.modal.listen())

  // Pass
  krabby.modes.pass = new Modal('Pass')
  krabby.modes.pass.on('start', () => {
    krabby.enabled = false
    krabby.mode = krabby.modes.pass
    krabby.modeName = 'Pass'
    krabby.statusLine.update()
  })

  // Hint
  krabby.env.HINT_SELECTORS = '*'
  krabby.env.HINT_TEXT_SELECTORS = 'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]), textarea, select'
  krabby.env.HINT_VIDEO_SELECTORS = 'video'

  krabby.modes.hint = ({ selections, selectors = '*', filters = [Hint.isClickable], lock = false } = {}) => {
    const hint = new Hint
    hint.selectors = selectors
    hint.filters = filters
    hint.lock = lock
    hint.on('validate', (target) => {
      Hint.focus(target)
      if (hint.lock) {
        if (selections.includes(target)) {
          selections.remove(target)
        } else {
          selections.add(target)
        }
      }
    })
    hint.on('start', () => {
      krabby.mode = hint
      krabby.modeName = 'Hint'
      krabby.modes.modal.unlisten()
      // Show video controls
      const videos = document.querySelectorAll('video')
      for (const video of videos) {
        krabby.mouse.hover(video)
      }
      krabby.statusLine.update()
    })
    hint.on('exit', () => {
      krabby.mouse.clear()
      krabby.modes.modal.listen()
    })
    return hint
  }

  // Selections ────────────────────────────────────────────────────────────────

  krabby.selections = new SelectionList
  krabby.selections.on('selection-change', (selections) => {
    krabby.modes.modal.updateContext()
    krabby.statusLine.update()
  })

  // Tools ─────────────────────────────────────────────────────────────────────

  krabby.scroll = new Scroll
  krabby.mouse = new Mouse

  // Marks
  krabby.mark = new Mark
  krabby.mark.on('push', (x, y, index) => krabby.commands.notify(`Position #${index} saved`))
  krabby.mark.on('pop', (x, y, index) => krabby.commands.notify(`Position #${index} deleted`))
  krabby.mark.on('jump', (x, y, index) => krabby.commands.notify(`Jumped to #${index}`))
  krabby.mark.on('clear', () => krabby.commands.notify('All marks removed'))

  // Commands ──────────────────────────────────────────────────────────────────

  krabby.commands = {}

  krabby.commands.notify = (message) => {
    krabby.modes.modal.notify({ id: 'information', message, duration: 3000 })
  }

  krabby.commands.click = (selections, modifierKeys = {}) => {
    for (const element of krabby.commands.getElements(selections)) {
      Mouse.click(element, modifierKeys)
    }
  }

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
      krabby.extensions.shell.send(krabby.env.OPENER, callback(link))
    }
  }

  krabby.commands.getElements = (selections) => {
    return selections.length
      ? selections.collection
      : [document.activeElement]
  }

  krabby.commands.yank = (selections, callback, message) => {
    const text = krabby.commands.getElements(selections).map(callback).join('\n')
    krabby.commands.copyToClipboard(text, message)
  }

  krabby.commands.yankFilteredHTML = (selections, filter) => {
    const input = krabby.commands.getElements(selections).map((element) => element.outerHTML).join('\n')
    krabby.extensions.shell.port.postMessage({
      id: 'html-filter',
      shell: true,
      command: filter,
      input
    })
  }

  krabby.commands.copyToClipboard = (text, message) => {
    Clipboard.copy(text)
    krabby.commands.notify(message)
  }

  krabby.commands.mpv = ({ selections, callback = (link) => link.href, reverse = false } = {}) => {
    const playlist = krabby.commands.getElements(selections).map(callback)
    if (reverse) {
      playlist.reverse()
    }
    krabby.extensions.shell.send('mpv', ...playlist)
  }

  krabby.commands.mpvResume = () => {
    const media = krabby.commands.player().media
    media.pause()
    krabby.extensions.shell.send('mpv', location.href, '-start', media.currentTime.toString())
  }

  krabby.commands.player = () => {
    const media = krabby.modes.modal.findParent((element) => element.querySelector('video'))
    Mouse.hover(media)
    return new Player(media)
  }

  krabby.commands.keep = async (selections, matching, ...attributes) => {
    const mode = matching ? 'Keep matching' : 'Keep not matching'
    const value = await krabby.modes.prompt.fire(`${mode} (${attributes})`)
    if (value === null) {
      return
    }
    const regex = new RegExp(value)
    selections.filter((selection) => attributes.some((attribute) => regex.test(selection[attribute]) === matching))
  }

  krabby.commands.select = async (selections) => {
    const value = await krabby.modes.prompt.fire('Select (querySelectorAll)')
    if (value === null) {
      return
    }
    selections.select(value)
  }

  // Mappings ──────────────────────────────────────────────────────────────────

  // Help
  krabby.modes.modal.map('Page', ['F1'], () => krabby.modes.modal.help(), 'Show help', 'Help')
  krabby.modes.modal.map('Page', ['Shift', 'F1'], () => window.open('https://github.com/alexherbo2/krabby/tree/master/doc'), 'Open the documentation in a new tab', 'Help')

  // External editor
  krabby.modes.modal.map('Text', ['Alt', 'KeyI'], () => krabby.extensions.editor.send('edit', krabby.env.EDITOR), 'Open your favorite editor', 'External editor')

  // Tab search
  krabby.modes.modal.map('Command', ['KeyQ'], () => krabby.extensions.dmenu.send('tab-search'), 'Tab search with dmenu', 'Tab search')

  // Scroll
  krabby.modes.modal.map('Command', ['KeyJ'], ({ repeat }) => krabby.scroll.down(repeat), 'Scroll down', 'Scroll')
  krabby.modes.modal.map('Command', ['KeyK'], ({ repeat }) => krabby.scroll.up(repeat), 'Scroll up', 'Scroll')
  krabby.modes.modal.map('Command', ['KeyL'], ({ repeat }) => krabby.scroll.right(repeat), 'Scroll right', 'Scroll')
  krabby.modes.modal.map('Command', ['KeyH'], ({ repeat }) => krabby.scroll.left(repeat), 'Scroll left', 'Scroll')

  // Scroll faster
  krabby.modes.modal.map('Command', ['Shift', 'KeyJ'], ({ repeat }) => krabby.scroll.pageDown(repeat), 'Scroll page down', 'Scroll faster')
  krabby.modes.modal.map('Command', ['Shift', 'KeyK'], ({ repeat }) => krabby.scroll.pageUp(repeat), 'Scroll page up', 'Scroll faster')
  krabby.modes.modal.map('Command', ['KeyG'], ({ repeat }) => krabby.scroll.top(repeat), 'Scroll to the top of the page', 'Scroll faster')
  krabby.modes.modal.map('Command', ['Shift', 'KeyG'], ({ repeat }) => krabby.scroll.bottom(repeat), 'Scroll to the bottom of the page', 'Scroll faster')

  // Navigation
  krabby.modes.modal.map('Command', ['Shift', 'KeyH'], () => history.back(), 'Go back in history', 'Navigation')
  krabby.modes.modal.map('Command', ['Shift', 'KeyL'], () => history.forward(), 'Go forward in history', 'Navigation')
  krabby.modes.modal.map('Command', ['KeyU'], () => location.assign('..'), 'Go up in hierarchy', 'Navigation')
  krabby.modes.modal.map('Command', ['Shift', 'KeyU'], () => location.assign('/'), 'Go to the home page', 'Navigation')
  krabby.modes.modal.map('Command', ['Alt', 'KeyU'], () => location.assign('.'), 'Remove any URL parameter', 'Navigation')

  // Marks
  krabby.modes.modal.map('Command', ['Shift', 'Quote'], () => krabby.mark.push(), 'Push mark', 'Marks')
  krabby.modes.modal.map('Command', ['Quote'], () => krabby.mark.jump(), 'Jump to mark', 'Marks')
  krabby.modes.modal.map('Command', ['Alt', 'Quote'], () => krabby.mark.pop(), 'Pop mark', 'Marks')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'Quote'], () => krabby.mark.clear(), 'Clear marks', 'Marks')

  // Zoom
  krabby.modes.modal.map('Command', ['Shift', 'Equal'], () => krabby.extensions.commands.send('zoom-in'), 'Zoom in', 'Zoom')
  krabby.modes.modal.map('Command', ['Minus'], () => krabby.extensions.commands.send('zoom-out'), 'Zoom out', 'Zoom')
  krabby.modes.modal.map('Command', ['Equal'], () => krabby.extensions.commands.send('zoom-reset'), 'Reset to default zoom level', 'Zoom')

  // Create tabs
  krabby.modes.modal.map('Command', ['KeyT'], () => krabby.extensions.commands.send('new-tab'), 'New tab', 'Create tabs')
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
  krabby.modes.modal.map('Command', ['KeyR'], () => location.reload(), 'Reload the page', 'Refresh tabs')
  krabby.modes.modal.map('Command', ['Shift', 'KeyR'], () => location.reload(true), 'Reload the page, ignoring cached content', 'Refresh tabs')
  krabby.modes.modal.map('Command', ['Alt', 'KeyR'], () => krabby.extensions.commands.send('reload-all-tabs'), 'Reload all tabs', 'Refresh tabs')

  // Switch tabs
  krabby.modes.modal.map('Command', ['Alt', 'KeyL'], () => krabby.extensions.commands.send('next-tab'), 'Next tab', 'Switch tabs')
  krabby.modes.modal.map('Command', ['Alt', 'KeyH'], () => krabby.extensions.commands.send('previous-tab'), 'Previous tab', 'Switch tabs')
  krabby.modes.modal.map('Command', ['Digit1'], () => krabby.extensions.commands.send('first-tab'), 'First tab', 'Switch tabs')
  krabby.modes.modal.map('Command', ['Digit0'], () => krabby.extensions.commands.send('last-tab'), 'Last tab', 'Switch tabs')

  // Move tabs
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyL'], () => krabby.extensions.commands.send('move-tab-right'), 'Move tab right', 'Move tabs')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyH'], () => krabby.extensions.commands.send('move-tab-left'), 'Move tab left', 'Move tabs')
  krabby.modes.modal.map('Command', ['Alt', 'Digit1'], () => krabby.extensions.commands.send('move-tab-first'), 'Move tab first', 'Move tabs')
  krabby.modes.modal.map('Command', ['Alt', 'Digit0'], () => krabby.extensions.commands.send('move-tab-last'), 'Move tab last', 'Move tabs')

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

  // Link hints
  krabby.modes.modal.map('Command', ['KeyF'], () => krabby.modes.hint({ selections: krabby.selections, selectors: krabby.env.HINT_SELECTORS }).start(), 'Focus link', 'Link hints')
  krabby.modes.modal.map('Command', ['Shift', 'KeyF'], () => krabby.modes.hint({ selections: krabby.selections, selectors: krabby.env.HINT_SELECTORS, lock: true }).start(), 'Select multiple links', 'Link hints')
  krabby.modes.modal.map('Command', ['KeyI'], () => krabby.modes.hint({ selectors: krabby.env.HINT_TEXT_SELECTORS }).start(), 'Focus input', 'Link hints')
  krabby.modes.modal.map('Command', ['KeyV'], () => krabby.modes.hint({ selectors: krabby.env.HINT_VIDEO_SELECTORS }).start(), 'Focus video', 'Link hints')

  // Open links
  krabby.modes.modal.map('Command', ['Enter'], () => krabby.commands.click(krabby.selections), 'Open selection', 'Open links')
  krabby.modes.modal.map('Link', ['Enter'], () => krabby.commands.click(krabby.selections), 'Open link', 'Open links')
  krabby.modes.modal.map('Link', ['Control', 'Enter'], () => krabby.commands.openInNewTab(krabby.selections), 'Open link in new tab', 'Open links')
  krabby.modes.modal.map('Link', ['Shift', 'Enter'], () => krabby.commands.openInNewWindow(krabby.selections), 'Open link in new window', 'Open links')
  krabby.modes.modal.map('Link', ['Alt', 'Enter'], () => krabby.commands.download(krabby.selections), 'Download link', 'Open links')
  krabby.modes.modal.map('Link', ['Alt', 'Shift', 'Enter'], () => krabby.commands.open(krabby.selections), 'Open link in the associated application', 'Open links')
  krabby.modes.modal.map('Image', ['Enter'], () => location.assign(krabby.modes.modal.activeElement.src), 'Open image', 'Open links')
  krabby.modes.modal.map('Image', ['Control', 'Enter'], () => krabby.commands.openInNewTab(krabby.selections, (selection) => selection.src), 'Open image in new tab', 'Open links')
  krabby.modes.modal.map('Image', ['Shift', 'Enter'], () => krabby.commands.openInNewWindow(krabby.selections, (selection) => selection.src), 'Open image in new window', 'Open links')
  krabby.modes.modal.map('Image', ['Alt', 'Enter'], () => krabby.commands.download(krabby.selections, (selection) => selection.src), 'Download image', 'Open links')
  krabby.modes.modal.map('Image', ['Alt', 'Shift', 'Enter'], () => krabby.commands.open(krabby.selections, (selection) => selection.src), 'Open image in the associated application', 'Open links')

  // Selection manipulation
  krabby.modes.modal.map('Command', ['KeyS'], () => krabby.selections.add(document.activeElement), 'Select active element', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Shift', 'KeyS'], () => krabby.commands.select(krabby.selections), 'Select elements that match the specified group of selectors', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Shift', 'Digit5'], () => krabby.selections.set([document.documentElement]), 'Select document', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Shift', 'Digit0'], () => krabby.selections.next(), 'Focus next selection', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Shift', 'Digit9'], () => krabby.selections.previous(), 'Focus previous selection', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Space'], () => krabby.selections.clear(), 'Clear selections', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Control', 'Space'], () => krabby.selections.focus(), 'Focus main selection', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'Space'], () => krabby.selections.remove(krabby.selections.mainSelection), 'Remove main selection', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'KeyA'], () => krabby.selections.parent(), 'Select parent elements', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'KeyI'], () => krabby.selections.children(), 'Select child elements', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyI'], () => krabby.selections.select('a'), 'Select links', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'Digit0'], () => krabby.selections.nextSibling(), 'Select next sibling elements', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'Digit9'], () => krabby.selections.previousSibling(), 'Select previous sibling elements', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['BracketLeft'], () => krabby.selections.firstChild(), 'Select first child elements', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['BracketRight'], () => krabby.selections.lastChild(), 'Select last child elements', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'KeyK'], () => krabby.commands.keep(krabby.selections, true, 'textContent'), 'Keep selections that match the given RegExp', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyK'], () => krabby.commands.keep(krabby.selections, true, 'href'), 'Keep links that match the given RegExp', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'KeyJ'], () => krabby.commands.keep(krabby.selections, false, 'textContent'), 'Clear selections that match the given RegExp', 'Selection manipulation')
  krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyJ'], () => krabby.commands.keep(krabby.selections, false, 'href'), 'Clear links that match the given RegExp', 'Selection manipulation')

  // Phantom selections
  krabby.modes.modal.map('Command', ['Shift', 'KeyZ'], () => krabby.selections.save(), 'Save selections', 'Phantom selections')
  krabby.modes.modal.map('Command', ['KeyZ'], () => krabby.selections.restore(), 'Restore selections', 'Phantom selections')

  // Unfocus
  krabby.modes.modal.map('Page', ['Escape'], () => document.activeElement.blur(), 'Unfocus active element', 'Unfocus')

  // Pass keys
  krabby.modes.modal.map('Page', ['Alt', 'Escape'], krabby.modes.pass, 'Pass all keys to the page', 'Pass keys')
  krabby.modes.pass.map('Page', ['Alt', 'Escape'], krabby.modes.modal, 'Stop passing keys to the page', 'Pass keys')

  // Clipboard
  krabby.modes.modal.map('Document', ['KeyY'], () => krabby.commands.copyToClipboard(location.href, 'Page address copied'), 'Copy page address', 'Clipboard')
  krabby.modes.modal.map('Document', ['Alt', 'KeyY'], () => krabby.commands.copyToClipboard(document.title, 'Page title copied'), 'Copy page title', 'Clipboard')
  krabby.modes.modal.map('Document', ['Shift', 'KeyY'], () => krabby.commands.copyToClipboard(`[${document.title}](${location.href})`, 'Page address and title copied'), 'Copy page address and title', 'Clipboard')
  krabby.modes.modal.map('Command', ['KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.outerHTML, 'HTML selection copied'), 'Copy HTML selection', 'Clipboard')
  krabby.modes.modal.map('Command', ['Alt', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.textContent, 'Selection copied as plain text'), 'Copy as plain text', 'Clipboard')
  krabby.modes.modal.map('Command', ['Shift', 'KeyY'], () => krabby.commands.yankFilteredHTML(krabby.selections, krabby.env.HTML_FILTER), 'Copy selection, using an HTML filter', 'Clipboard')
  krabby.modes.modal.map('Link', ['KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.href, 'Link address copied'), 'Copy link address', 'Clipboard')
  krabby.modes.modal.map('Link', ['Alt', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.textContent, 'Link text copied'), 'Copy link text', 'Clipboard')
  krabby.modes.modal.map('Link', ['Shift', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => `[${selection.textContent}](${selection.href})`, 'Link address and text copied'), 'Copy link address and text', 'Clipboard')
  krabby.modes.modal.map('Image', ['KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.src, 'Image address copied'), 'Copy image address', 'Clipboard')
  krabby.modes.modal.map('Image', ['Alt', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.alt, 'Image description copied'), 'Copy image description', 'Clipboard')
  krabby.modes.modal.map('Image', ['Shift', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => `[${selection.alt}](${selection.src})`, 'Image address and description copied'), 'Copy image address and description', 'Clipboard')

  // Player
  krabby.modes.modal.map('Video', ['Space'], () => krabby.commands.player().pause(), 'Pause video', 'Player')
  krabby.modes.modal.map('Video', ['KeyM'], () => krabby.commands.player().mute(), 'Mute video', 'Player')
  krabby.modes.modal.map('Video', ['KeyL'], () => krabby.commands.player().seekRelative(5), 'Seek forward 5 seconds', 'Player')
  krabby.modes.modal.map('Video', ['KeyH'], () => krabby.commands.player().seekRelative(-5), 'Seek backward 5 seconds', 'Player')
  krabby.modes.modal.map('Video', ['KeyG'], () => krabby.commands.player().seekAbsolutePercent(0), 'Seek to the beginning', 'Player')
  krabby.modes.modal.map('Video', ['Shift', 'KeyG'], () => krabby.commands.player().seekAbsolutePercent(1), 'Seek to the end', 'Player')
  krabby.modes.modal.map('Video', ['KeyK'], () => krabby.commands.player().increaseVolume(0.1), 'Increase volume', 'Player')
  krabby.modes.modal.map('Video', ['KeyJ'], () => krabby.commands.player().decreaseVolume(0.1), 'Decrease volume', 'Player')
  krabby.modes.modal.map('Video', ['KeyF'], () => krabby.commands.player().fullscreen(), 'Toggle full-screen mode', 'Player')
  krabby.modes.modal.map('Video', ['KeyP'], () => krabby.commands.player().pictureInPicture(), 'Toggle picture-in-picture mode', 'Player')

  // mpv
  krabby.modes.modal.map('Document', ['KeyM'], () => krabby.extensions.shell.send('mpv', location.href), 'Play with mpv', 'mpv')
  krabby.modes.modal.map('Video', ['Enter'], () => krabby.commands.mpvResume(), 'Play with mpv', 'mpv')
  krabby.modes.modal.map('Link', ['KeyM'], () => krabby.commands.mpv({ selections: krabby.selections }), 'Play with mpv', 'mpv')
  krabby.modes.modal.map('Link', ['Alt', 'KeyM'], () => krabby.commands.mpv({ selections: krabby.selections, reverse: true }), 'Play with mpv in reverse order', 'mpv')
  krabby.modes.modal.map('Image', ['KeyM'], () => krabby.commands.mpv({ selections: krabby.selections, callback: (image) => image.src }), 'Play with mpv', 'mpv')
  krabby.modes.modal.map('Image', ['Alt', 'KeyM'], () => krabby.commands.mpv({ selections: krabby.selections, callback: (image) => image.src, reverse: true }), 'Play with mpv in reverse order', 'mpv')

  // Initialization ────────────────────────────────────────────────────────────

  if (dormant) {
    krabby.modes.pass.listen()
  } else {
    krabby.modes.modal.listen()
  }

  return krabby
}
