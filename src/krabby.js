// Environment variables ───────────────────────────────────────────────────────

switch (true) {
  case (typeof browser !== 'undefined'):
    var PLATFORM = 'firefox'
    var COMMANDS_EXTENSION_ID = 'commands@alexherbo2.github.com'
    var SHELL_EXTENSION_ID = 'shell@alexherbo2.github.com'
    var DMENU_EXTENSION_ID = 'dmenu@alexherbo2.github.com'
    break
  case (typeof chrome !== 'undefined'):
    var PLATFORM = 'chrome'
    var COMMANDS_EXTENSION_ID = 'cabmgmngameccclicfmcpffnbinnmopc'
    var SHELL_EXTENSION_ID = 'ohgecdnlcckpfnhjepfdcdgcfgebkdgl'
    var DMENU_EXTENSION_ID = 'gonendiemfggilnopogmkafgadobkoeh'
    break
}

// Extensions ──────────────────────────────────────────────────────────────────

// Commands
const commands = {}
commands.port = chrome.runtime.connect(COMMANDS_EXTENSION_ID)
commands.send = (command, ...arguments) => {
  commands.port.postMessage({ command, arguments })
}

// Shell
const shell = {}
shell.port = chrome.runtime.connect(SHELL_EXTENSION_ID)
shell.send = (command, ...arguments) => {
  shell.port.postMessage({ command, arguments })
}

// dmenu
const dmenu = {}
dmenu.port = chrome.runtime.connect(DMENU_EXTENSION_ID)
dmenu.send = (command, ...arguments) => {
  dmenu.port.postMessage({ command, arguments })
}

// Status line ─────────────────────────────────────────────────────────────────

const updateStatusLine = () => {
  modal.notify({ id: 'status-line', message: `${modal.context.name} (${selections.length})` })
}

// Modes ───────────────────────────────────────────────────────────────────────

// Modal
const modal = new Modal('Modal')
modal.activeElement = () => {
  return selections.length
    ? selections.mainSelection
    : document.activeElement
}
modal.filter('Gmail', () => location.hostname === 'mail.google.com')
modal.enable('Gmail', 'Video', 'Image', 'Link', 'Text', 'Command')
modal.on('context-change', (context) => updateStatusLine())

// Prompt
const prompt = new Prompt
prompt.on('open', () => modal.unlisten())
prompt.on('close', () => modal.listen())

// Pass
const pass = new Modal('Pass')

// Hint
const HINT_TEXT_SELECTORS = 'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]), textarea, select'
const HINT_VIDEO_SELECTORS = 'video'

const hint = ({ selections, selectors = '*', lock = false } = {}) => {
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
    }
  })
  hint.on('start', () => {
    modal.unlisten()
    // Show video controls
    const videos = document.querySelectorAll('video')
    for (const video of videos) {
      mouse.hover(video)
    }
  })
  hint.on('exit', () => {
    mouse.clear()
    modal.listen()
  })
  return hint
}

// Selections ──────────────────────────────────────────────────────────────────

const selections = new SelectionList
selections.on('selection-change', (selections) => updateStatusLine())

// Tools ───────────────────────────────────────────────────────────────────────

const scroll = new Scroll
const mouse = new Mouse

// Commands ────────────────────────────────────────────────────────────────────

const notify = (message) => {
  modal.notify({ id: 'information', message, duration: 3000 })
}

const click = (selections, modifierKeys = {}) => {
  const elements = selections.length
    ? selections.collection
    : [document.activeElement]
  for (const element of elements) {
    Mouse.click(element, modifierKeys)
  }
}

const open = (selections) => {
  const links = selections.length
    ? selections.collection
    : [document.activeElement]
  for (const link of links) {
    shell.send('xdg-open', link.href)
  }
}

const yank = (selections, callback, message) => {
  const text = selections.length
    ? selections.map(callback).join('\n')
    : callback(document.activeElement)
  copyToClipboard(text, message)
}

const copyToClipboard = (text, message) => {
  Clipboard.copy(text)
  notify(message)
}

const mpv = ({ selections, reverse = false } = {}) => {
  const playlist = selections.length
    ? selections.map((link) => link.href)
    : [document.activeElement.href]
  if (reverse) {
    playlist.reverse()
  }
  shell.send('mpv', ...playlist)
}

const mpvResume = () => {
  const media = player().media
  media.pause()
  shell.send('mpv', location.href, '-start', media.currentTime.toString())
}

const player = () => {
  const media = modal.findParent((element) => element.querySelector('video'))
  Mouse.hover(media)
  return new Player(media)
}

const keep = async (selections, matching, ...attributes) => {
  const mode = matching ? 'Keep matching' : 'Keep not matching'
  const value = await prompt.fire(`${mode} (${attributes})`)
  if (value === null) {
    return
  }
  const regex = new RegExp(value)
  selections.filter((selection) => attributes.some((attribute) => regex.test(selection[attribute]) === matching))
}

const select = async (selections) => {
  const value = await prompt.fire('Select (querySelectorAll)')
  if (value === null) {
    return
  }
  selections.select(value)
}

// Mappings ────────────────────────────────────────────────────────────────────

// Help
modal.map('Page', ['F1'], () => modal.help(), 'Show help')
modal.map('Page', ['Shift', 'F1'], () => window.open('https://github.com/alexherbo2/krabby/tree/master/doc'), 'Open the documentation in a new tab')

// Tab search
modal.map('Command', ['KeyQ'], () => dmenu.send('tab-search'), 'Tab search with dmenu')

// Scroll
modal.map('Command', ['KeyJ'], (event) => scroll.down(event.repeat), 'Scroll down')
modal.map('Command', ['KeyK'], (event) => scroll.up(event.repeat), 'Scroll up')
modal.map('Command', ['KeyL'], (event) => scroll.right(event.repeat), 'Scroll right')
modal.map('Command', ['KeyH'], (event) => scroll.left(event.repeat), 'Scroll left')

// Scroll faster
modal.map('Command', ['Shift', 'KeyJ'], () => scroll.pageDown(), 'Scroll page down')
modal.map('Command', ['Shift', 'KeyK'], () => scroll.pageUp(), 'Scroll page up')
modal.map('Command', ['KeyG'], () => scroll.top(), 'Scroll to the top of the page')
modal.map('Command', ['Shift', 'KeyG'], () => scroll.bottom(), 'Scroll to the bottom of the page')

// Navigation
modal.map('Command', ['Shift', 'KeyH'], () => history.back(), 'Go back in history')
modal.map('Command', ['Shift', 'KeyL'], () => history.forward(), 'Go forward in history')
modal.map('Command', ['KeyU'], () => location.assign('..'), 'Go up in hierarchy')
modal.map('Command', ['Shift', 'KeyU'], () => location.assign('/'), 'Go to the home page')
modal.map('Command', ['Alt', 'KeyU'], () => location.assign('.'), 'Remove any URL parameter')

// Zoom
modal.map('Command', ['Shift', 'Equal'], () => commands.send('zoom-in'), 'Zoom in')
modal.map('Command', ['Minus'], () => commands.send('zoom-out'), 'Zoom out')
modal.map('Command', ['Equal'], () => commands.send('zoom-reset'), 'Reset to default zoom level')

// Create tabs
modal.map('Command', ['KeyT'], () => commands.send('new-tab'), 'New tab')
modal.map('Command', ['Shift', 'KeyT'], () => commands.send('restore-tab'), 'Restore tab')
modal.map('Command', ['KeyB'], () => commands.send('duplicate-tab'), 'Duplicate tab')

// Create windows
modal.map('Command', ['KeyN'], () => commands.send('new-window'), 'New window')
modal.map('Command', ['Shift', 'KeyN'], () => commands.send('new-incognito-window'), 'New incognito window')

// Close tabs
modal.map('Command', ['KeyX'], () => commands.send('close-tab'), 'Close tab')
modal.map('Command', ['Shift', 'KeyX'], () => commands.send('close-other-tabs'), 'Close other tabs')
modal.map('Command', ['Alt', 'KeyX'], () => commands.send('close-right-tabs'), 'Close tabs to the right')

// Refresh tabs
modal.map('Command', ['KeyR'], () => location.reload(), 'Reload the page')
modal.map('Command', ['Shift', 'KeyR'], () => location.reload(true), 'Reload the page, ignoring cached content')
modal.map('Command', ['Alt', 'KeyR'], () => commands.send('reload-all-tabs'), 'Reload all tabs')

// Switch tabs
modal.map('Command', ['Alt', 'KeyL'], () => commands.send('next-tab'), 'Next tab')
modal.map('Command', ['Alt', 'KeyH'], () => commands.send('previous-tab'), 'Previous tab')
modal.map('Command', ['Digit1'], () => commands.send('first-tab'), 'First tab')
modal.map('Command', ['Digit0'], () => commands.send('last-tab'), 'Last tab')

// Move tabs
modal.map('Command', ['Alt', 'Shift', 'KeyL'], () => commands.send('move-tab-right'), 'Move tab right')
modal.map('Command', ['Alt', 'Shift', 'KeyH'], () => commands.send('move-tab-left'), 'Move tab left')
modal.map('Command', ['Alt', 'Digit1'], () => commands.send('move-tab-first'), 'Move tab first')
modal.map('Command', ['Alt', 'Digit0'], () => commands.send('move-tab-last'), 'Move tab last')

// Detach tabs
modal.map('Command', ['KeyD'], () => commands.send('detach-tab'), 'Detach tab')
modal.map('Command', ['Shift', 'KeyD'], () => commands.send('attach-tab'), 'Attach tab')

// Discard tabs
modal.map('Command', ['Shift', 'Escape'], () => commands.send('discard-tab'), 'Discard tab')

// Mute tabs
modal.map('Command', ['Alt', 'KeyM'], () => commands.send('mute-tab'), 'Mute tab')
modal.map('Command', ['Alt', 'Shift', 'KeyM'], () => commands.send('mute-all-tabs'), 'Mute all tabs')

// Pin tabs
modal.map('Command', ['Alt', 'KeyP'], () => commands.send('pin-tab'), 'Pin tab')

// Link hints
modal.map('Command', ['KeyF'], () => hint().start(), 'Focus link')
modal.map('Command', ['Shift', 'KeyF'], () => hint({ selections, lock: true }).start(), 'Select multiple links')
modal.map('Command', ['KeyI'], () => hint({ selectors: HINT_TEXT_SELECTORS }).start(), 'Focus input')
modal.map('Command', ['KeyV'], () => hint({ selectors: HINT_VIDEO_SELECTORS }).start(), 'Focus video')

// Open links
modal.map('Link', ['Enter'], () => click(selections), 'Open link')
modal.map('Link', ['Control', 'Enter'], () => click(selections, { ctrlKey: true }), 'Open link in new tab')
modal.map('Link', ['Shift', 'Enter'], () => click(selections, { shiftKey: true }), 'Open link in new window')
modal.map('Link', ['Alt', 'Enter'], () => click(selections, { altKey: true }), 'Download link')
modal.map('Link', ['Alt', 'Shift', 'Enter'], () => open(selections), 'Open link in the associated application')

// Selection manipulation
modal.map('Command', ['KeyS'], () => selections.add(document.activeElement), 'Select active element')
modal.map('Command', ['Shift', 'KeyS'], () => select(selections), 'Select elements that match the specified group of selectors')
modal.map('Command', ['Shift', 'Digit5'], () => selections.set([document.documentElement]), 'Select document')
modal.map('Command', ['Shift', 'Digit0'], () => selections.next(), 'Focus next selection')
modal.map('Command', ['Shift', 'Digit9'], () => selections.previous(), 'Focus previous selection')
modal.map('Command', ['Space'], () => selections.clear(), 'Clear selections')
modal.map('Command', ['Control', 'Space'], () => selections.focus(), 'Focus main selection')
modal.map('Command', ['Alt', 'Space'], () => selections.remove(), 'Remove main selection')
modal.map('Command', ['Alt', 'KeyA'], () => selections.parent(), 'Select parent elements')
modal.map('Command', ['Alt', 'KeyI'], () => selections.children(), 'Select child elements')
modal.map('Command', ['Alt', 'Shift', 'KeyI'], () => selections.select('a'), 'Select links')
modal.map('Command', ['Alt', 'KeyK'], () => keep(selections, true, 'textContent'), 'Keep selections that match the given RegExp')
modal.map('Command', ['Alt', 'Shift', 'KeyK'], () => keep(selections, true, 'href'), 'Keep links that match the given RegExp')
modal.map('Command', ['Alt', 'KeyJ'], () => keep(selections, false, 'textContent'), 'Clear selections that match the given RegExp')
modal.map('Command', ['Alt', 'Shift', 'KeyJ'], () => keep(selections, false, 'href'), 'Clear links that match the given RegExp')

// Phantom selections
modal.map('Command', ['Shift', 'KeyZ'], () => selections.save(), 'Save selections')
modal.map('Command', ['KeyZ'], () => selections.restore(), 'Restore selections')

// Unfocus
modal.map('Page', ['Escape'], () => document.activeElement.blur(), 'Unfocus active element')

// Pass keys
modal.map('Page', ['Alt', 'Escape'], pass, 'Pass all keys to the page')
pass.map('Page', ['Alt', 'Escape'], modal, 'Stop passing keys to the page')

// Clipboard
modal.map('Command', ['KeyY'], () => copyToClipboard(location.href, 'Page address copied'), 'Copy page address')
modal.map('Command', ['Alt', 'KeyY'], () => copyToClipboard(document.title, 'Page title copied'), 'Copy page title')
modal.map('Command', ['Shift', 'KeyY'], () => copyToClipboard(`[${document.title}](${location.href})`, 'Page address and title copied'), 'Copy page address and title')
modal.map('Link', ['KeyY'], () => yank(selections, (selection) => selection.href, 'Link address copied'), 'Copy link address')
modal.map('Link', ['Alt', 'KeyY'], () => yank(selections, (selection) => selection.textContent, 'Link text copied'), 'Copy link text')
modal.map('Link', ['Shift', 'KeyY'], () => yank(selections, (selection) => `[${selection.textContent}](${selection.href})`, 'Link address and text copied'), 'Copy link address and text')
modal.map('Image', ['KeyY'], () => yank(selections, (selection) => selection.src, 'Image address copied'), 'Copy image address')
modal.map('Image', ['Alt', 'KeyY'], () => yank(selections, (selection) => selection.alt, 'Image description copied'), 'Copy image description')
modal.map('Image', ['Shift', 'KeyY'], () => yank(selections, (selection) => `[${selection.alt}](${selection.src})`, 'Image address and description copied'), 'Copy image address and description')

// Player
modal.map('Video', ['Space'], () => player().pause(), 'Pause video')
modal.map('Video', ['KeyM'], () => player().mute(), 'Mute video')
modal.map('Video', ['KeyL'], () => player().seekRelative(5), 'Seek forward 5 seconds')
modal.map('Video', ['KeyH'], () => player().seekRelative(-5), 'Seek backward 5 seconds')
modal.map('Video', ['KeyG'], () => player().seekAbsolutePercent(0), 'Seek to the beginning')
modal.map('Video', ['Shift', 'KeyG'], () => player().seekAbsolutePercent(1), 'Seek to the end')
modal.map('Video', ['KeyK'], () => player().increaseVolume(0.1), 'Increase volume')
modal.map('Video', ['KeyJ'], () => player().decreaseVolume(0.1), 'Decrease volume')
modal.map('Video', ['KeyF'], () => player().fullscreen(), 'Toggle full-screen mode')
modal.map('Video', ['KeyP'], () => player().pictureInPicture(), 'Toggle picture-in-picture mode')

// mpv
modal.map('Video', ['Enter'], () => mpvResume(), 'Play with mpv')
modal.map('Link', ['KeyM'], () => mpv({ selections }), 'Play with mpv')
modal.map('Link', ['Alt', 'KeyM'], () => mpv({ selections, reverse: true }), 'Play with mpv in reverse order')

// Initialization ──────────────────────────────────────────────────────────────

modal.listen()
