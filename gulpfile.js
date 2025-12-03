const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');

// Таска для HTML
const htmlTask = () => {
    return src("src/app/index.html")
        .pipe(fileInclude({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
};

// Таска для SCSS
const scssTask = () => {
    return src("src/app/scss/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
};

// Таска для JS
function jsTask() {
    return src('src/app/js/script.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// Таска для картинок
function imgTask() {
    return src('src/app/img/*', { encoding: false })
        .pipe(dest('dist/img'));
}

// Підключення Bootstrap
const bootstrapCSS = () => {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'));
}

const bootstrapJS = () => {
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'));
}

// BrowserSync
function serve() {
    browserSync.init({
        server: { baseDir: 'dist/' }
    });
    watch('src/app/**/*.html', htmlTask);
    watch('src/app/**/*.scss', scssTask);
    watch('src/app/js/*.js', jsTask);
}

// Головна задача
exports.default = series(
    parallel(htmlTask, scssTask, jsTask, imgTask, bootstrapCSS, bootstrapJS),
    serve
);
