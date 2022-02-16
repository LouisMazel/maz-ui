import { vClickOutside, vClickOutsideInstall } from './click-outside.directive'
import { vClosable, vClosableInstall } from './closable.directive'
import {
  vZoomImg,
  vZoomImgInstall,
  vZoomImgOptions,
  vZoomImgBinding,
} from './zoom-img.directive'
import {
  vLazyImg,
  vLazyImgInstall,
  vLazyImgOptions,
  vLazyImgBinding,
} from './v-lazy-img'

const directives = [
  {
    name: 'click-outside',
    directive: vClickOutside,
  },
  {
    name: 'closable',
    directive: vClosable,
  },
  {
    name: 'zoom-img',
    directive: vZoomImg,
  },
  {
    name: 'lazy-img',
    directive: vLazyImg,
  },
]

const installDirectives = {
  install(app) {
    directives.forEach(({ name, directive }) => {
      app.directive(name, directive)
    })
  },
}

export {
  vClickOutside,
  vClickOutsideInstall,
  vClosable,
  vClosableInstall,
  vLazyImg,
  vLazyImgOptions,
  vLazyImgBinding,
  vLazyImgInstall,
  vZoomImg,
  vZoomImgOptions,
  vZoomImgBinding,
  vZoomImgInstall,
  installDirectives,
}
