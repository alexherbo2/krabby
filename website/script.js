const parseButtonKeys = (button) => {
  const keyChord = Array.from(button.querySelectorAll('kbd'), (kbd) => [
    kbd.hasAttribute('shift') && 'Shift',
    kbd.getAttribute('code') || kbd.textContent,
  ].filter(Boolean)).flat()
  return keyChord
}

const preventFocus = (event) => {
  event.preventDefault()
  if (event.relatedTarget) {
    // Revert focus back to the previous blurring element.
    event.relatedTarget.focus({ preventScroll: true })
  } else {
    // No previous focus target, blur instead.
    event.currentTarget.blur()
  }
}

const DOMContentLoaded = (event) => {
  const modes = { modal, pass }
  for (const button of document.querySelectorAll('button.krabby')) {
    const mode = modes[button.getAttribute('mode')]
    const keyChord = parseButtonKeys(button)
    button.addEventListener('click', (event) => {
      // Prevent propagation, so hint mode does not quit immediately.
      event.stopImmediatePropagation()
      mode.play(keyChord)
    })
    button.addEventListener('focus', preventFocus)
  }
  for (const carousel of document.querySelectorAll('.carousel')) {
    new Carousel(carousel)
  }
  // Link hints
  const HINT_SELECTORS = ':not(.krabby)'
  modal.map('Command', ['KeyF'], () => hint({ selections, selectors: HINT_SELECTORS }).start(), 'Focus link')
  modal.map('Command', ['Shift', 'KeyF'], () => hint({ selections, selectors: HINT_SELECTORS, lock: true }).start(), 'Select multiple links')
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded)
