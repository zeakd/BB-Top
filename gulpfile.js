/* Top Page View 
 * 
 * page     : BeanBrothers 
 * author   : zeakd
 */

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var gp = gulpLoadPlugins();

var bowerRequirejs = require('bower-requirejs');
var amdOptimize = require('amd-optimize');
var del =require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config = {
    app: 'app',
    preRelease: 'pre-release',
    release: 'release',
    tmp: '.tmp'
};

gulp.task('default', ['build', 'serve:release']);

gulp.task('bower', function() {
    var options = {
        config: config.app +'/scripts/main.js'
    }
    bowerRequirejs(options, function(rjsConfigFromBower){})
})
gulp.task('html', ['clean'], function() {
    var assets = gp.useref.assets();
    return gulp.src(config.app + '/*.html')
        .pipe(assets)
        .pipe(gp.print())
        .pipe(gp.if('*.js', gulp.dest(config.preRelease)))
        .pipe(assets.restore())
        //.pipe(gp.print())
        .pipe(gp.useref())
        .pipe(gulp.dest(config.preRelease))
        .pipe(gulp.dest(config.release))
});

gulp.task('less', ['clean'], function() {
    return gulp.src([
        config.app + '/styles/less/bootstrap-beanbrothers-theme.less'
    ])
        .pipe(gp.less())
        .pipe(gp.rename({
            basename: 'style'
        }))
        .pipe(gulp.dest(config.preRelease + '/styles'))
        .pipe(gp.minifyCss())
        .pipe(gulp.dest(config.release + '/styles'))
        //.pipe(connect.reload());
});
gulp.task('less:dev', ['clean:tmp'], function(){
    return gulp.src([
        config.app + '/styles/less/bootstrap-beanbrothers-theme.less'
    ])
        .pipe(gp.rename({
            basename: 'style'
        }))
    //return gulp.src(config.app + '/styles/*.less')
        .pipe(gp.less({
            //paths: [config.app + '/styles/less']
        }))
        .pipe(gulp.dest(config.tmp + '/styles'))
        //.pipe(connect.reload())
});

gulp.task('scripts', ['clean'], function(){
    return gulp.src(config.app + '/scripts/**/*.js')
        .pipe(amdOptimize('main', {
            shim: {
                bootstrap: {
                    deps: [
                        'jquery'
                    ]
                }
            },
            paths: {
                jquery: config.app + '/bower_components/jquery/dist/jquery',
                backbone: config.app + '/bower_components/backbone/backbone',
                underscore: config.app + '/bower_components/underscore/underscore',
                requirejs: config.app + '/bower_components/requirejs/require',
                bootstrap: config.app + '/bower_components/bootstrap/dist/js/bootstrap',
            }
        }))
        .pipe(gp.concat('main.js'))
        .pipe(gulp.dest(config.preRelease + '/scripts'))
        .pipe(gulp.dest(config.release + '/scripts'))
})
gulp.task('images', ['clean'], function() {
    return gulp.src(config.app + '/images/**/*')
        .pipe(gp.if(gp.if.isFile, gp.cache(gp.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest(config.preRelease + '/images'))
        .pipe(gulp.dest(config.release + '/images'))
});

gulp.task('fonts', ['clean'], function() {
    return gulp.src(require('main-bower-files')({
        filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat('app/fonts/**/*'))
        .pipe(gulp.dest(config.preRelease + '/fonts'))
        .pipe(gulp.dest(config.release + '/fonts'))
});

gulp.task('serve', ['serve:dev'])
gulp.task('serve:dev', ['less:dev'], function() {
    browserSync.init({
        server: {
            baseDir: [config.tmp, config.app]
        },
        browser : 'google chrome'
    })

    gulp.watch([
        config.app + '/*.html',
        config.app + '/scripts/**/*.js',
        config.app + '/images/**/*',
        config.tmp + '/fonts/**/*',
        config.tmp + '/styles/**/*'
    ]).on('change', reload);
    //gulp.watch([ config.app + '/**/*.js' ])

    gulp.watch([ config.app + '/styles/**/*.less' ], ['less:dev'])
    //gulp.watch(config.app + '/fonts/**/*', ['fonts']);
})
gulp.task('serve:pre', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: [config.preRelease]
        }
    })

    gulp.watch([
        config.preRelease + '/*.html',
        config.preRelease + '/scripts/**/*.js',
        config.preRelease + '/images/**/*',
        config.preRelease + '/fonts/**/*',
        config.preRelease + '/styles/**/*'
    ]).on('change', reload);
    //gulp.watch([ config.app + '/**/*.js' ])

    //gulp.watch(config.app + '/fonts/**/*', ['fonts']);
})

gulp.task('serve:release', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: [config.release]
        },
        browser: 'google chrome'
    })

    gulp.watch([
        config.release + '/*.html',
        config.release + '/scripts/**/*.js',
        config.release + '/images/**/*',
        config.release + '/fonts/**/*',
        config.release + '/styles/**/*'
    ]).on('change', reload);
    //gulp.watch([ config.app + '/**/*.js' ])

    //gulp.watch(config.app + '/fonts/**/*', ['fonts']);
})

gulp.task('build', ['clean', 'html', 'less', 'scripts', 'images', 'fonts'], function() {

})

gulp.task('clean', ['clean:tmp'], function(cb) {
    del([config.preRelease, config.release],cb);
})

gulp.task('clean:tmp', function(cb) {
    del([config.tmp],cb);
})