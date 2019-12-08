function Krabby({ dormant = true } = {}) {

  const krabby = {}

  krabby.enabled = false
  krabby.mode = undefined
  krabby.modeName = ''
  krabby.env = {}

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

  // Mouse selection ───────────────────────────────────────────────────────────

  krabby.selection = Selection.create({

    // Class for the selection-area
    class: 'selection',

    // All elements in this container can be selected
    selectables: ['a']

  }).on('beforestart', ({ oe }) => {

    // Prefix key to start selection: Control or Command key (⌘).
    // Return false to cancel selection.
    if (! (oe.ctrlKey || oe.metaKey)) {
      return false
    }

  }).on('move', ({ changed: { added, removed } }) => {

    // Update selections
    krabby.selections.add(...added)
    krabby.selections.remove(...removed)

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
      window.open(callback(link))
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

  krabby.commands.copyToClipboard = (text, message) => {
    Clipboard.copy(text)
    krabby.commands.notify(message)
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

  // Refresh tabs
  krabby.modes.modal.map('Command', ['KeyR'], () => location.reload(), 'Reload the page', 'Refresh tabs')
  krabby.modes.modal.map('Command', ['Shift', 'KeyR'], () => location.reload(true), 'Reload the page, ignoring cached content', 'Refresh tabs')

  // Link hints
  krabby.modes.modal.map('Command', ['KeyF'], () => krabby.modes.hint({ selections: krabby.selections, selectors: krabby.env.HINT_SELECTORS }).start(), 'Focus link', 'Link hints')
  krabby.modes.modal.map('Command', ['Shift', 'KeyF'], () => krabby.modes.hint({ selections: krabby.selections, selectors: krabby.env.HINT_SELECTORS, lock: true }).start(), 'Select multiple links', 'Link hints')
  krabby.modes.modal.map('Command', ['KeyI'], () => krabby.modes.hint({ selectors: krabby.env.HINT_TEXT_SELECTORS }).start(), 'Focus input', 'Link hints')
  krabby.modes.modal.map('Command', ['KeyV'], () => krabby.modes.hint({ selectors: krabby.env.HINT_VIDEO_SELECTORS }).start(), 'Focus video', 'Link hints')

  // Open links
  krabby.modes.modal.map('Command', ['Enter'], () => krabby.commands.click(krabby.selections), 'Open selection', 'Open links')
  krabby.modes.modal.map('Link', ['Enter'], () => krabby.commands.click(krabby.selections), 'Open link', 'Open links')
  krabby.modes.modal.map('Link', ['Control', 'Enter'], () => krabby.commands.click(krabby.selections, { ctrlKey: true }), 'Open link in new tab', 'Open links')
  krabby.modes.modal.map('Link', ['Shift', 'Enter'], () => krabby.commands.click(krabby.selections, { shiftKey: true }), 'Open link in new window', 'Open links')
  krabby.modes.modal.map('Link', ['Alt', 'Enter'], () => krabby.commands.click(krabby.selections, { altKey: true }), 'Download link', 'Open links')
  krabby.modes.modal.map('Image', ['Enter'], () => location.assign(krabby.modes.modal.activeElement.src), 'Open image', 'Open links')
  krabby.modes.modal.map('Image', ['Control', 'Enter'], () => krabby.commands.openInNewTab(krabby.selections, (selection) => selection.src), 'Open image in new tab', 'Open links')

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

  // Initialization ────────────────────────────────────────────────────────────

  if (dormant) {
    krabby.modes.pass.listen()
  } else {
    krabby.modes.modal.listen()
  }

  return krabby
}
