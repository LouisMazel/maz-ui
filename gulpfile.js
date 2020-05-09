'use strict'

const { src, series, dest, watch } = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const prefix = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')

const onError = err => {
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


const compileComponentsSingleFileCss = () => {
  return src('./packages/scss/components/*.scss')
    .pipe(sass.sync())
    .pipe(prefix())
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./lib'))
}

const compile = () => {
  return src('./packages/scss/index.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass.sync(sassOptions).on('error', sass.logError))
    .pipe(prefix())
    .pipe(rename('maz-ui.css'))
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./lib'))
}

const watcher = () => {
  watch('packages/scss/**/*.scss', compile)
}

// BUILD TASKS
// ------------

exports.default = series(compile, compileComponentsSingleFileCss, watcher)
exports.compile = series(compile, compileComponentsSingleFileCss)
