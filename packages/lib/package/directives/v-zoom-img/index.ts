import { vZoomImg } from './zoom-img.directive'
import type { vZoomImgBinding, vZoomImgOptions } from './zoom-img.handler'

const plugin = {
  install(app) {
    app.directive('zoom-img', vZoomImg)
  },
}

export { plugin as vZoomImgInstall, vZoomImg, vZoomImgBinding, vZoomImgOptions }
