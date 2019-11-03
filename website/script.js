const DOMContentLoaded = (event) => {
  for (const carousel of document.querySelectorAll('.carousel')) {
    new Carousel(carousel)
  }
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded)
