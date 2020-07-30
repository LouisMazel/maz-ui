const style = `
.maz-img-preview {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 1050;
  background-color: rgba(86, 87, 117, .7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.maz-img-preview img {
  max-width: 100%;
  max-height: 100%;
}

.maz-img-preview img,
.maz-img-preview button {
  transition: all 300ms ease-in-out;
  opacity: 0;
  transform: scale(0.5);
}

.maz-img-preview button {
  margin-bottom: 20px;
  border: none;
  background-color: white;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  cursor: pointer;
}

.maz-img-preview button:hover {
  background-color: #ccc;
}

.maz-img-preview.maz-animate img,
.maz-img-preview.maz-animate button {
  opacity: 1;
  transform: scale(1);
}`

const addStyle = (styleString) => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.id = 'MazPreviewStyle'
  style.textContent = styleString
  document.head.append(style)
}

const closePreview = () => {
  const container = document.querySelector('#MazImgPreviewFullsize')
  const style = document.querySelector('#MazPreviewStyle')

  if (container) { container.classList.remove('maz-animate') }
  setTimeout(() => {
    if (container) { container.remove() }
    if (style) { style.remove() }
  }, 500)
}

const keydownLister = (e) => {
  if (e.keyCode === 27) {
    document.removeEventListener('keydown', keydownLister)
    closePreview()
  }
}

const renderPreview = ({ src, alt }) => {
  addStyle(style)

  const container = document.createElement('div')
  container.classList = 'maz-img-preview'
  container.setAttribute('id', 'MazImgPreviewFullsize')
  container.addEventListener('click', (e) => {
    if (container.isEqualNode(e.target)) { closePreview() }
  })

  const img = document.createElement('img')
  img.setAttribute('src', src)
  img.setAttribute('alt', alt)
  img.classList.add('maz-border-radius')

  const icon = document.createElement('i')
  icon.classList.add('material-icons')
  icon.appendChild(document.createTextNode('close'))
  const button = document.createElement('button')
  button.onclick = () => {
    closePreview()
  }
  button.appendChild(icon)

  container.append(button, img)
  document.body.appendChild(container)
  document.addEventListener('keydown', keydownLister)
  setTimeout(() => { if (container) { container.classList.add('maz-animate') } }, 150)
}

export default {
  bind (el, binding) {
    if (binding.value.disabled) { return }
    if (!binding.value) { throw new Error('[MazUI](img-preview) url of image must be provided') }
    const options = {
      src: binding.value.src || binding.value,
      alt: binding.value.alt
    }
    const bindEvent = binding.arg || 'click'
    el.addEventListener(bindEvent, () => renderPreview(options))
  },
  unbind (el, binding) {
    const bindEvent = binding.arg || 'click'
    el.removeEventListener(bindEvent, () => renderPreview())
  }
}
