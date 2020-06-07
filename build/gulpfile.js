'use strict'

const { src, series, dest, watch } = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const prefix = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const merge = require('merge-stream')
const replace = require('gulp-replace')
const del = require('del')

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

const buildScssLibrary = () => {
  const components = src('./../packages/scss/components/*.scss')
    .pipe(dest('./../lib/scss'))
  const base = src('./../packages/scss/base.scss')
    .pipe(dest('./../lib/scss'))
  const variables = src('./../packages/scss/variables.scss')
    .pipe(dest('./../lib/scss'))
  const common = src('./../packages/scss/components/common/**/*')
    .pipe(dest('./../lib/scss/components/common'))
  const styleHelpers = src('./../packages/scss/style-helpers/**/*')
    .pipe(dest('./../lib/scss/style-helpers'))
  return merge(components, base, variables, common, styleHelpers)
}

const replaceScssPaths = () => {
  return src(['./../lib/scss/*.scss'])
    .pipe(replace('./../style-helpers/variables/index.scss', './style-helpers/variables/index.scss'))
    .pipe(dest('./../lib/scss'))
}

const cleanScss = () => {
  return del(['./../lib/scss/common'], { force:true })
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
  watch('packages/scss/**/*.scss', compileComponentsSingleFileCss, compileBase, compileCss)
}

// BUILD TASKS
// ------------

exports.default = series(compileComponentsSingleFileCss, compileBase, compileCss, watcher)
exports.compile = series(compileComponentsSingleFileCss, compileBase, compileCss)
exports.buildScssLibrary = series(buildScssLibrary, replaceScssPaths, cleanScss)
