const { src, series, dest, watch } = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const prefix = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')

const onError = (err) => {
  notify.onError({
    title: 'Gulp',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'Basso'
  })(err)
}

const sassOptions = {
  outputStyle: 'expanded'
}

// BUILD SUBTASKS
// ---------------

const compile = () => {
  return src('packages/scss/index.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass.sync(sassOptions).on('error', sass.logError))
    .pipe(prefix())
    .pipe(rename('maz-ui.css'))
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('dist'))
}

const watcher = () => {
  watch('packages/scss/**/*.scss', compile)
}

// BUILD TASKS
// ------------

exports.default = series(compile, watcher)
exports.compileScss = compile
