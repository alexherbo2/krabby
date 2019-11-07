const krabby = {}

krabby.enabled = false
krabby.mode = undefined
krabby.modeName = ''
krabby.env = {}

// Status line ─────────────────────────────────────────────────────────────────

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

// Modes ───────────────────────────────────────────────────────────────────────

krabby.modes = {}

// Modal
krabby.modes.modal = new Modal('Modal')
krabby.modes.modal.activeElement = () => {
  return krabby.selections.length
    ? krabby.selections.mainSelection
    : Modal.getDeepActiveElement()
}
krabby.modes.modal.enable('Video', 'Image', 'Link', 'Text', 'Command')
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

krabby.modes.hint = ({ selections, selectors = '*', lock = false } = {}) => {
  const hint = new Hint
  hint.selectors = selectors
  hint.lock = lock
  hint.on('validate', (target) => {
    if (hint.lock) {
      if (selections.includes(target)) {
        selections.remove(target)
      } else {
        selections.add(target)
      }
    } else {
      target.focus()
      if (document.activeElement !== target) {
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

// Selections ──────────────────────────────────────────────────────────────────

krabby.selections = new SelectionList
krabby.selections.on('selection-change', (selections) => krabby.statusLine.update())

// Tools ───────────────────────────────────────────────────────────────────────

krabby.scroll = new Scroll
krabby.mouse = new Mouse

// Commands ────────────────────────────────────────────────────────────────────

krabby.commands = {}

krabby.commands.notify = (message) => {
  krabby.modes.modal.notify({ id: 'information', message, duration: 3000 })
}

krabby.commands.click = (selections, modifierKeys = {}) => {
  for (const element of krabby.commands.getElements(selections)) {
    Mouse.click(element, modifierKeys)
  }
}

krabby.commands.getElements = (selections) => {
  return selections.length
    ? selections.collection
    : [document.activeElement]
}

krabby.commands.yank = (selections, callback, message) => {
  const text = selections.length
    ? selections.map(callback).join('\n')
    : callback(document.activeElement)
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

// Mappings ────────────────────────────────────────────────────────────────────

// Help
krabby.modes.modal.map('Page', ['F1'], () => krabby.modes.modal.help(), 'Show help')
krabby.modes.modal.map('Page', ['Shift', 'F1'], () => window.open('https://github.com/alexherbo2/krabby/tree/master/doc'), 'Open the documentation in a new tab')

// Scroll
krabby.modes.modal.map('Command', ['KeyJ'], (event) => krabby.scroll.down(event.repeat), 'Scroll down')
krabby.modes.modal.map('Command', ['KeyK'], (event) => krabby.scroll.up(event.repeat), 'Scroll up')
krabby.modes.modal.map('Command', ['KeyL'], (event) => krabby.scroll.right(event.repeat), 'Scroll right')
krabby.modes.modal.map('Command', ['KeyH'], (event) => krabby.scroll.left(event.repeat), 'Scroll left')

// Scroll faster
krabby.modes.modal.map('Command', ['Shift', 'KeyJ'], () => krabby.scroll.pageDown(), 'Scroll page down')
krabby.modes.modal.map('Command', ['Shift', 'KeyK'], () => krabby.scroll.pageUp(), 'Scroll page up')
krabby.modes.modal.map('Command', ['KeyG'], () => krabby.scroll.top(), 'Scroll to the top of the page')
krabby.modes.modal.map('Command', ['Shift', 'KeyG'], () => krabby.scroll.bottom(), 'Scroll to the bottom of the page')

// Navigation
krabby.modes.modal.map('Command', ['Shift', 'KeyH'], () => history.back(), 'Go back in history')
krabby.modes.modal.map('Command', ['Shift', 'KeyL'], () => history.forward(), 'Go forward in history')
krabby.modes.modal.map('Command', ['KeyU'], () => location.assign('..'), 'Go up in hierarchy')
krabby.modes.modal.map('Command', ['Shift', 'KeyU'], () => location.assign('/'), 'Go to the home page')
krabby.modes.modal.map('Command', ['Alt', 'KeyU'], () => location.assign('.'), 'Remove any URL parameter')

// Reload pages
krabby.modes.modal.map('Command', ['KeyR'], () => location.reload(), 'Reload the page')
krabby.modes.modal.map('Command', ['Shift', 'KeyR'], () => location.reload(true), 'Reload the page, ignoring cached content')

// Link hints
krabby.modes.modal.map('Command', ['KeyF'], () => krabby.modes.hint({ selections: krabby.selections, selectors: krabby.env.HINT_SELECTORS }).start(), 'Focus link')
krabby.modes.modal.map('Command', ['Shift', 'KeyF'], () => krabby.modes.hint({ selections: krabby.selections, selectors: krabby.env.HINT_SELECTORS, lock: true }).start(), 'Select multiple links')
krabby.modes.modal.map('Command', ['KeyI'], () => krabby.modes.hint({ selectors: krabby.env.HINT_TEXT_SELECTORS }).start(), 'Focus input')
krabby.modes.modal.map('Command', ['KeyV'], () => krabby.modes.hint({ selectors: krabby.env.HINT_VIDEO_SELECTORS }).start(), 'Focus video')

// Open links
krabby.modes.modal.map('Command', ['Enter'], () => krabby.commands.click(krabby.selections), 'Open selection')
krabby.modes.modal.map('Link', ['Enter'], () => krabby.commands.click(krabby.selections), 'Open link')
krabby.modes.modal.map('Link', ['Control', 'Enter'], () => krabby.commands.click(krabby.selections, { ctrlKey: true }), 'Open link in new tab')
krabby.modes.modal.map('Link', ['Shift', 'Enter'], () => krabby.commands.click(krabby.selections, { shiftKey: true }), 'Open link in new window')
krabby.modes.modal.map('Link', ['Alt', 'Enter'], () => krabby.commands.click(krabby.selections, { altKey: true }), 'Download link')

// Selection manipulation
krabby.modes.modal.map('Command', ['KeyS'], () => krabby.selections.add(document.activeElement), 'Select active element')
krabby.modes.modal.map('Command', ['Shift', 'KeyS'], () => krabby.commands.select(krabby.selections), 'Select elements that match the specified group of selectors')
krabby.modes.modal.map('Command', ['Shift', 'Digit5'], () => krabby.selections.set([document.documentElement]), 'Select document')
krabby.modes.modal.map('Command', ['Shift', 'Digit0'], () => krabby.selections.next(), 'Focus next selection')
krabby.modes.modal.map('Command', ['Shift', 'Digit9'], () => krabby.selections.previous(), 'Focus previous selection')
krabby.modes.modal.map('Command', ['Space'], () => krabby.selections.clear(), 'Clear selections')
krabby.modes.modal.map('Command', ['Control', 'Space'], () => krabby.selections.focus(), 'Focus main selection')
krabby.modes.modal.map('Command', ['Alt', 'Space'], () => krabby.selections.remove(), 'Remove main selection')
krabby.modes.modal.map('Command', ['Alt', 'KeyA'], () => krabby.selections.parent(), 'Select parent elements')
krabby.modes.modal.map('Command', ['Alt', 'KeyI'], () => krabby.selections.children(), 'Select child elements')
krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyI'], () => krabby.selections.select('a'), 'Select links')
krabby.modes.modal.map('Command', ['Alt', 'Shift', 'Digit0'], () => krabby.selections.nextSibling(), 'Select next sibling elements')
krabby.modes.modal.map('Command', ['Alt', 'Shift', 'Digit9'], () => krabby.selections.previousSibling(), 'Select previous sibling elements')
krabby.modes.modal.map('Command', ['BracketLeft'], () => krabby.selections.firstChild(), 'Select first child elements')
krabby.modes.modal.map('Command', ['BracketRight'], () => krabby.selections.lastChild(), 'Select last child elements')
krabby.modes.modal.map('Command', ['Alt', 'KeyK'], () => krabby.commands.keep(krabby.selections, true, 'textContent'), 'Keep selections that match the given RegExp')
krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyK'], () => krabby.commands.keep(krabby.selections, true, 'href'), 'Keep links that match the given RegExp')
krabby.modes.modal.map('Command', ['Alt', 'KeyJ'], () => krabby.commands.keep(krabby.selections, false, 'textContent'), 'Clear selections that match the given RegExp')
krabby.modes.modal.map('Command', ['Alt', 'Shift', 'KeyJ'], () => krabby.commands.keep(krabby.selections, false, 'href'), 'Clear links that match the given RegExp')

// Phantom selections
krabby.modes.modal.map('Command', ['Shift', 'KeyZ'], () => krabby.selections.save(), 'Save selections')
krabby.modes.modal.map('Command', ['KeyZ'], () => krabby.selections.restore(), 'Restore selections')

// Unfocus
krabby.modes.modal.map('Page', ['Escape'], () => document.activeElement.blur(), 'Unfocus active element')

// Pass keys
krabby.modes.modal.map('Page', ['Alt', 'Escape'], krabby.modes.pass, 'Pass all keys to the page')
krabby.modes.pass.map('Page', ['Alt', 'Escape'], krabby.modes.modal, 'Stop passing keys to the page')

// Clipboard
krabby.modes.modal.map('Command', ['KeyY'], () => krabby.commands.copyToClipboard(location.href, 'Page address copied'), 'Copy page address')
krabby.modes.modal.map('Command', ['Alt', 'KeyY'], () => krabby.commands.copyToClipboard(document.title, 'Page title copied'), 'Copy page title')
krabby.modes.modal.map('Command', ['Shift', 'KeyY'], () => krabby.commands.copyToClipboard(`[${document.title}](${location.href})`, 'Page address and title copied'), 'Copy page address and title')
krabby.modes.modal.map('Link', ['KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.href, 'Link address copied'), 'Copy link address')
krabby.modes.modal.map('Link', ['Alt', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.textContent, 'Link text copied'), 'Copy link text')
krabby.modes.modal.map('Link', ['Shift', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => `[${selection.textContent}](${selection.href})`, 'Link address and text copied'), 'Copy link address and text')
krabby.modes.modal.map('Image', ['KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.src, 'Image address copied'), 'Copy image address')
krabby.modes.modal.map('Image', ['Alt', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => selection.alt, 'Image description copied'), 'Copy image description')
krabby.modes.modal.map('Image', ['Shift', 'KeyY'], () => krabby.commands.yank(krabby.selections, (selection) => `[${selection.alt}](${selection.src})`, 'Image address and description copied'), 'Copy image address and description')

// Player
krabby.modes.modal.map('Video', ['Space'], () => krabby.commands.player().pause(), 'Pause video')
krabby.modes.modal.map('Video', ['KeyM'], () => krabby.commands.player().mute(), 'Mute video')
krabby.modes.modal.map('Video', ['KeyL'], () => krabby.commands.player().seekRelative(5), 'Seek forward 5 seconds')
krabby.modes.modal.map('Video', ['KeyH'], () => krabby.commands.player().seekRelative(-5), 'Seek backward 5 seconds')
krabby.modes.modal.map('Video', ['KeyG'], () => krabby.commands.player().seekAbsolutePercent(0), 'Seek to the beginning')
krabby.modes.modal.map('Video', ['Shift', 'KeyG'], () => krabby.commands.player().seekAbsolutePercent(1), 'Seek to the end')
krabby.modes.modal.map('Video', ['KeyK'], () => krabby.commands.player().increaseVolume(0.1), 'Increase volume')
krabby.modes.modal.map('Video', ['KeyJ'], () => krabby.commands.player().decreaseVolume(0.1), 'Decrease volume')
krabby.modes.modal.map('Video', ['KeyF'], () => krabby.commands.player().fullscreen(), 'Toggle full-screen mode')
krabby.modes.modal.map('Video', ['KeyP'], () => krabby.commands.player().pictureInPicture(), 'Toggle picture-in-picture mode')

// Initialization ──────────────────────────────────────────────────────────────

krabby.modes.pass.listen()
