export default {
  inserted: (el, binding) => {
    const valueNormalized = typeof binding.value === 'object' ? binding.value : { slug: binding.value, disabled: false }

    const loadImage = () => {
      if (el) {
        el.addEventListener('load', () => {
          setTimeout(() => el.classList.add('maz-lazy-loaded'), 100)
        })
        el.addEventListener('error', () => console.log('maz-lazy-error'))
        if (binding.arg === 'background-image') {
          el.style.backgroundImage = `url('${valueNormalized.slug}')`
        } else {
          el.src = valueNormalized.slug
        }
      }
    }

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }

    const createObserver = () => {
      const options = {
        root: null,
        threshold: '0'
      }
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }

    if (window['IntersectionObserver']) {
      createObserver()
    } else {
      loadImage()
    }
  }
}