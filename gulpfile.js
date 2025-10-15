import { src, dest, watch, series, parallel } from 'gulp';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import fileInclude from 'gulp-file-include';
import browserSyncLib from 'browser-sync';
import dartSass from 'sass';

const browserSync = browserSyncLib.create();
const sassCompiler = sass(dartSass);

// HTML (з file-include)
export const htmlTask = () => {
    return src('app/index.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

// SCSS
export const scssTask = () => {
    return src('app/scss/*.scss')
        .pipe(sassCompiler())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
};

//  JS
export const jsTask = () => {
    return src('app/js/*.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
};

//  Images
export const imgTask = () => {
    return src('app/img/*', { encoding: false })
        .pipe(dest('dist/imgs'));
};

//  Bootstrap
export const bootstrapCSS = () => {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'));
};

export const bootstrapJS = () => {
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'));
};

//  BrowserSync
export const serve = () => {
    browserSync.init({
        server: { baseDir: 'dist/' }
    });
    watch('app/**/*.html', htmlTask);
    watch('app/scss/*.scss', scssTask);
    watch('app/js/*.js', jsTask);
};

//Головна задача
export default series(
    parallel(htmlTask, scssTask, jsTask, imgTask, bootstrapCSS, bootstrapJS),
    serve
);
