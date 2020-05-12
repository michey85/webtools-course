const fs = require('fs');
const { src, dest, series, watch, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

function bundleJs() {
    return src('./src/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(dest('./dist/js'))
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(dest('./dist/js'));
}

function serve() {
    return browserSync.init({
        server: {
            baseDir: './dist',
        },
    });
}

function compilePug() {
    return src(['./src/**/*.pug', '!./src/includes/**/*.pug'])
        .pipe(
            pug({
                locals: {
                    nav: JSON.parse(fs.readFileSync('./data/nav.json', 'utf8')),
                },
                pretty: true,
            })
        )
        .pipe(dest('./dist'));
}

function compileSass() {
    return src('./src/sass/index.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(rename('styles.css'))
        .pipe(dest('./dist/css'))
        .pipe(browserSync.stream());
}

function imageMinification() {
    return src('./src/images/**')
        .pipe(newer('./dist/img'))
        .pipe(imagemin())
        .pipe(dest('./dist/img'));
}

function watcher() {
    watch('./src/**/*.pug', compilePug).on('change', browserSync.reload);
    watch('./src/sass/**/*.scss', compileSass);
}

exports.pug = function () {
    watch('./src/**/*.pug', { ignoreInitial: false }, compilePug);
};
exports.style = compileSass;

exports.default = function () {
    compilePug();
    compileSass();
    serve();
    watcher();
};
exports.image = imageMinification;
exports.serve = serve;

exports.bundle = bundleJs;
