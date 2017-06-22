'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    rigger = require('gulp-rigger'),
    less = require('gulp-less'),
    reload = browserSync.reload,    
    rimraf = require('gulp-rimraf');//,
    //cleanCSS = require('gulp-clean-css'),    
    //htmlmin = require('gulp-htmlmin');

var path = {
    bower: {
        jquery: ['./bower_components/jquery/dist/jquery.min.js','./dev/js/vendor/jquery/jquery.min.js']
    },
    build: { // compiled files
        html: './build/',        
        partialsJs: './build/js/',
        js: './build/js/',
        css: './build/css/',
        fonts: './build/css/fonts/',
        img: './build/img/',        
        assets: './build/assets/'
    },
    dev: { // development files
        html: './dev/*.html', 
        partialsJs: ['./dev/js/**/**/*.js', './dev/js/**/**/*.json'],
        js: './dev/js/app.js',
        css: ['./dev/css/styles.less','./dev/css/landing.less'],
        fonts: './dev/css/fonts/**/*.*',
        img: './dev/img/**/*.*',         
        assets: './dev/assets/*.*'
    },
    watch: { // watching files
        html: './dev/**/*.html',
        js: './dev/js/**/*.js',
        css: './dev/css/**/*.less',        
        fonts: './dev/css/fonts/**/*.*',
        img: './dev/img/**/*.*',        
        assets: './dev/assets/*.*'
    },
    clean: './build'
};

var webServerConfig = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "project"
};

gulp.task('html:build', function () {
    return gulp.src(path.dev.html)       
        .pipe(rigger())
        //.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.dev.css)         
        .pipe(less())
        //.pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    return gulp.src(path.dev.fonts)                     
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.dev.partialsJs).pipe(gulp.dest(path.build.partialsJs));

    return gulp.src(path.dev.js)
        .pipe(gulp.dest(path.build.js)) 
        .pipe(reload({stream: true})); 
});

gulp.task('img:build', function () {
    return gulp.src(path.dev.img) 
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('assets:build', function () {
    return gulp.src(path.dev.assets) 
        .pipe(gulp.dest(path.build.assets))
        .pipe(reload({stream: true}));
});

gulp.task('build', [    
    'html:build',
    'style:build',
    'fonts:build',
    'js:build',
    'img:build',
    'assets:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.assets], function(event, cb) {
        gulp.start('assets:build');
    });        
});

gulp.task('webserver', function () {
    browserSync(webServerConfig);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);    
});

gulp.task('default', ['build', 'webserver', 'watch']);