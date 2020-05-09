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

// BUILD SUBTASKS
// ---------------


const compileComponentsSingleFileCss = () => {
  return src('./../packages/scss/components/*.scss')
    .pipe(sass.sync())
    .pipe(prefix())
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./../lib/css'))
}

const compileCss = () => {
  return src('./../packages/scss/index.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(prefix())
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename('index.css'))
    .pipe(dest('./../lib/css'))
}

const compileBase = () => {
  return src('./../packages/scss/base.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(prefix())
    .pipe(rename('base.css'))
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./../lib/css'))
}

const watcher = () => {
  watch('packages/scss/**/*.scss', compileBase, compileCss, compileComponentsSingleFileCss)
}

// BUILD TASKS
// ------------

exports.default = series(compileBase, compileCss, compileComponentsSingleFileCss, watcher)
exports.compile = series(compileBase, compileCss, compileComponentsSingleFileCss)
