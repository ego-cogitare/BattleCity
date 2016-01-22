var es = require('event-stream'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    inject = require('gulp-inject'),
    runSequence = require('run-sequence'),
    download = require('gulp-download'),
    shell = require('gulp-shell'),
    imageop = require('gulp-image-optimization'),
    minifyHTML = require('gulp-minify-html');

var handleError = function (err) {
    console.log(err.name, ' in ', err.plugin, ': ', err.message);
    console.log(err.getStack());
    process.exit(1);
};

// Copy
gulp.task('copy', function () {
  return es.concat(
    gulp.src(['index.html'])
        .pipe(gulp.dest('build')),

    gulp.src('app/asset/**/*')
        .pipe(gulp.dest('build/app/asset'))
  );
});

gulp.task('minifyHtml', function() {
    var opts = {
        conditionals: true,
        spare: true
    };
    return gulp.src('build/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('build'));
});
   
gulp.task('optymizeImages', function(cb) {
    gulp.src('app/asset/textures/**/*').pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest('build/app/asset/textures'))
    .on('end', cb)
    .on('error', cb);
});

gulp.task('jsInjectBuild', function () {
    var target = gulp.src('build/index.html');
    var sources = gulp.src('build/battlecity.min.js', { read: false });

    return target.pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('build'));
});

gulp.task('cssInjectBuild', function () {
    var target = gulp.src('build/index.html');
    var sources = gulp.src('build/style.min.css', { read: false });

    return target.pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('build'));
});

// CSS uglify
gulp.task('cssUglify', function () {
    return gulp.src(['app/css/**/*', 'app/vendors/bootstrap/dist/css/bootstrap.min.css', 'app/vendors/bootstrap/dist/css/bootstrap-theme.min.css'])
        .pipe(minifycss().on('error', handleError))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('build'));
});

// JavaScript uglify
gulp.task('jsUglify', function () {
    return gulp.src(['app/vendors/pixi/bin/pixi.js','app/vendors/underscore/underscore-min.js','app/js/app/**/*'])
        .pipe(uglify().on('error', handleError))
        .pipe(concat('battlecity.min.js'))
        .pipe(gulp.dest('build'));
});

// JavaScript concat
gulp.task('jsConcat', function () {
    return gulp.src(['build/app/js/app/**/*'])
        .pipe(concat('battlecity.min.js'))
        .pipe(gulp.dest('build/app/js/app'));
});

/* ANDROID */
gulp.task('copyMobile', function() {
    return gulp.src('build/**/*').pipe(gulp.dest('mobile/www'));
});
gulp.task('runAndroid', shell.task('cd mobile && ionic run android'));
/* ANDROID */

gulp.task('default', build);

gulp.task('build', build);

function build(cb){
    return runSequence('copy', 'jsUglify', 'cssUglify', 'jsInjectBuild', 'cssInjectBuild', 'optymizeImages', 'minifyHtml', 'copyMobile', cb);
}

function cloned (templateDir) {
    return fsUtils.isDir(templateDir) && fsUtils.isEmptyDir(templateDir);
}