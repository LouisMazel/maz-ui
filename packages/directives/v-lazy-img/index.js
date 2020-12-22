let observers = []

const success = (el) => {
  setTimeout(() => el.classList.add('maz-lazy-loaded'), 100)
}
const error = (el) => {
  setTimeout(() => el.classList.add('maz-lazy-loaded'), 100)
}

const loadImage = (el, binding) => {
  const valueNormalized = typeof binding.value === 'object' ? binding.value : { slug: binding.value, disabled: false }

  el.addEventListener('load', () => success(el))
  el.addEventListener('error', () => error(el))
  if (binding.arg === 'background-image') {
    el.style.backgroundImage = `url('${valueNormalized.slug}')`
    success(el)
  } else {
    el.src = valueNormalized.slug
  }
}

const handleIntersect = (el, binding, entries, observer) => {
  observers.push(observer)
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadImage(el, binding)
      observer.unobserve(el)
    }
  })
}

const createObserver = (el, binding) => {
  const options = {
    root: null,
    threshold: '0'
  }
  const observer = new IntersectionObserver(
    (entries, observer) => handleIntersect(el, binding, entries, observer),
    options
  )
  observer.observe(el)
}

const imageHandler = (el, binding, type) => {
  if (type === 'update') {
    // Clean all previous observers
    observers.forEach((observer) => observer.unobserve(el))
  }
  if (window.IntersectionObserver) {
    createObserver(el, binding)
  } else {
    loadImage(el, binding)
  }
}

export default {
  bind: (el, binding) => imageHandler(el, binding, 'bind'),
  update: (el, binding) => imageHandler(el, binding, 'update'),
  unbind: (el, binding) => {
    if (binding.arg === 'background-image') el.style.backgroundImage = undefined
    el.classList.remove('maz-lazy-loaded')
    el.classList.remove('maz-lazy-error')
    el.removeEventListener('load', () => success(el))
    el.removeEventListener('error', () => error(el))
    observers.forEach((observer) => observer.unobserve(el))
    observers = []
  }
}
