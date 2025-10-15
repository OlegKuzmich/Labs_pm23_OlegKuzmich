function defaultTask(cb) {
    // place code for your default task here
    console.log('Gulp is running');
    cb();
}

exports.default = defaultTask

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
//const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');


// Таска для HTML
function htmlTask() {
    return src('app/**/*.html')
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// Таска для SCSS
function scssTask() {
    return src('app/scss/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Таска для JS
function jsTask() {
    return src('app/js/*.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// Таска для зображень
function imgTask() {
    return src('app/img/*', {encoding: false})

        .pipe(dest('dist/imgs'));
}

// BrowserSync
function serve() {
    browserSync.init({
        server: { baseDir: 'dist/' }
    });
    watch('app/**/*.html', htmlTask);
    watch('app/scss/*.scss', scssTask);
    watch('app/js/*.js', jsTask);
}

// Головна задача
exports.default = series(
    parallel(htmlTask, scssTask, jsTask,imgTask,
        serve)
);

// Приклад html таски з бібліотеки gulp-file-include
function html_task() {
    return src('app/index.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}
exports.html_task = html_task;


const bootstrapCSS = () => {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'));
}

const bootstrapJS = () => {
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'));
}