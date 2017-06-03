var gulp = require('gulp'),
	notify = require("gulp-notify"),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	csso = require('gulp-csso'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	browserSync = require('browser-sync').create(),
	clean = require('gulp-dest-clean'),
	gulpSequence = require('gulp-sequence');

// Compile sass
gulp.task('styles', function () { // название должно говорить что делает таск -- работает со стилями
  return gulp.src('./dev/sass/**/*.scss') // указываем с какой папки берет файлы scss
    .pipe(sass().on('error', sass.logError)) //отслеживает ошибки, ошибки создаются в отдельный файл
    .pipe(autoprefixer({browsers: ['last 4 versions']})) // дописывает префиксы для последних 4-х версий браузеров
    .pipe(gulp.dest('./prod/css')) // перемещает скомпилированный файл в папку css
    .pipe(rename({suffix: '.min'}))// переименовует файл, дописывает в конце .min
    .pipe(csso()) // ужимает файл
    .pipe(gulp.dest('./prod/css')) // перемещает минимизированный файл -- 2 файла в папке: css, min.css
    .pipe(notify({ message: 'Styles task complete' })) // выдает сообщение
    .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(['./dev/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./prod/js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js/'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .pipe(browserSync.stream());
});

// Minify images
gulp.task('images', () =>
    gulp.src('./dev/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./prod/images'))
        .pipe(notify({ message: 'Images task complete' }))
);

/* Fonts to Dist */
gulp.task('fonts', function() {
    gulp.src('./dev/fonts/*.*')
    .pipe(gulp.dest('./prod/fonts'));
});

/* Clean Prod Dir */
gulp.task('clean', function() {
    return gulp.src('./dev')
    	.pipe(clean('./prod'))
	    .pipe(notify({ message: 'Clean task complete' }));
});

// Browser sync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


// Build
gulp.task('build', gulpSequence('clean', 'fonts', 'styles', 'scripts', 'images', 'browser-sync'));


/* Watcher */
gulp.task('watch', function() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./dev/sass/main.scss', ['styles', browserSync.reload]); // отслеживает изменение в файлах и автоматически начинает выполнение таска
    gulp.watch('./dev/js/main.js', ['scripts', browserSync.reload]);
    gulp.watch("*.html").on("change", browserSync.reload);
});