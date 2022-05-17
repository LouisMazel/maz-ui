module.exports = {
  '.padded-container': {
    width: '100%',
    'padding-left': 'var(--maz-container-padding)',
    'padding-right': 'var(--maz-container-padding)',
  },
  '.padded-container-no-p': {
    width: '100%',
    'padding-left': 'calc(50% - var(--maz-container-max-width) / 2)',
    'padding-right': 'calc(50% - var(--maz-container-max-width) / 2)',
  },
  '.elevation': {
    'box-shadow': '0 5px 20px 0 rgba(0, 0, 0, .1)',
  },
  '.flex-center': {
    'align-items': 'center',
    'justify-content': 'center',
  },
}
