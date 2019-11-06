const parseButtonKeys = (button) => {
  const keyChord = Array.from(button.querySelectorAll('kbd'), (kbd) => [
    kbd.hasAttribute('shift') && 'Shift',
    kbd.getAttribute('code') || kbd.textContent,
  ].filter(Boolean)).flat()
  return keyChord
}

const DOMContentLoaded = (event) => {
  const modes = { modal, pass }
  for (const button of document.querySelectorAll('button.krabby')) {
    const mode = modes[button.getAttribute('mode')]
    const keyChord = parseButtonKeys(button)
    button.addEventListener('click', (event) => mode.play(keyChord))
  }
  for (const carousel of document.querySelectorAll('.carousel')) {
    new Carousel(carousel)
  }
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded)
