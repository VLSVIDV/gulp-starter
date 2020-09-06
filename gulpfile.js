"use strict";

const { task, src, dest, watch, series, parallel } = require("gulp"),
  gcmq = require("gulp-group-css-media-queries"),
  browserSync = require("browser-sync").create(),
  glp = require("gulp-load-plugins")(),
  include = require("gulp-file-include"),
  del = require("del"),
  gulpIf = require("gulp-if"),
  svgcss = require("gulp-svg-css"),
  pngquant = require("imagemin-pngquant"),
  mozjpeg = require("imagemin-mozjpeg"),
  strip = require("gulp-strip-comments");
//rsync = require('gulp-rsync')
//fontgen = require('gulp-fontgen')

/////////////////////////////////////////////////
//---------------------PUG---------------------//
/////////////////////////////////////////////////
function pug() {
  return src("src/pug/structure/**/*.pug")
    .pipe(
      glp.plumber({
        errorHandler: glp.notify.onError(function (err) {
          return {
            title: "PUG error",
            message: err.message,
          };
        }),
      })
    )
    .pipe(
      glp.pug({
        pretty: true,
      })
    )
    .pipe(strip())
    .pipe(dest("build/"))
    .on("end", browserSync.reload);
};

exports.pug = pug; // this is in case of running "pug" as single task. It was task(pug) in gulp 3

/////////////////////////////////////////////////
//--------------------SASS---------------------//
/////////////////////////////////////////////////
function sass() {
  return (
    src("src/sass/style.scss")
      .pipe(
        glp.plumber({
          errorHandler: glp.notify.onError(function (err) {
            return {
              title: "SASS error",
              message: err.message,
            };
          }),
        })
      )
      .pipe(glp.sass())
      .pipe(glp.autoprefixer({ grid: "autoplace" }))
      .pipe(gcmq())
      .pipe(glp.csscomb())
      .pipe(
        glp.csso({
          restructure: false,
          sourceMap: true,
          debug: true,
        })
      )
      .pipe(
        glp.rename({
          extname: ".min.css",
        })
      )
      //.pipe(glp.sourcemaps.write())
      .pipe(dest("build/css"))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
};

exports.sass = sass;

/////////////////////////////////////////////////
//-------------------SCRIPTS-------------------//
/////////////////////////////////////////////////

function scripts_libs() {
  return src([
    "node_modules/jquery/dist/jquery.min.js",
    //'node_modules/object-fit-images/dist/ofi.min.js',
    //'node_modules/svg4everybody/dist/svg4everybody.min.js',
    //'node_modules/jquery-validation/dist/jquery.validate.min.js',
    //'node_modules/imask/dist/imask.min.js',
    //'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
    //'node_modules/blazy/blazy.min.js'
  ])
    .pipe(glp.concat("libs.min.js"))
    .pipe(strip())
    .pipe(dest("build/js/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};

exports.scripts_libs = scripts_libs;

function scripts() {
  return src("src/js/main.js")
    .pipe(
      glp.plumber({
        errorHandler: glp.notify.onError(function (err) {
          return {
            title: "js:include",
            message: err.message,
          };
        }),
      })
    )
    .pipe(
      include({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(
      glp.babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(glp.uglify())
    .pipe(
      glp.rename({
        extname: ".min.js",
      })
    )
    .pipe(strip())
    .pipe(dest("build/js/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
};

exports.scripts = scripts;

/////////////////////////////////////////////////
//---------------------IMG---------------------//
/////////////////////////////////////////////////
function img() {
  return src("src/img/**/*")
    .pipe(
      glp.cache(
        glp.imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [
            {
              interlaced: true,
            },
            {
              removeViewBox: false,
            },
            {
              removeUselessStrokeAndFill: false,
            },
            {
              cleanupIDs: false,
            },
          ],
          use: [
            pngquant([
              {
                quality: "65-80",
              },
            ]),
          ],
          use: [
            mozjpeg([
              {
                progressive: true,
                quality: 80,
              },
            ]),
          ],
        })
      )
    )
    .pipe(dest("build/img"));
};

exports.img = img;

function imgUpload() {
  return src("src/upload/**/*")
    .pipe(
      glp.cache(
        glp.imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [
            {
              interlaced: true,
            },
            {
              removeViewBox: false,
            },
            {
              removeUselessStrokeAndFill: false,
            },
            {
              cleanupIDs: false,
            },
          ],
          use: [
            pngquant([
              {
                quality: "65-80",
              },
            ]),
          ],
          use: [
            mozjpeg([
              {
                progressive: true,
                quality: 80,
              },
            ]),
          ],
        })
      )
    )
    .pipe(dest("build/upload"));
};

exports.imgUpload = imgUpload;

/////////////////////////////////////////////////
//-----------------CLEAR CACHE-----------------//
/////////////////////////////////////////////////

function clear() {
  return glp.cache.clearAll();
};

exports.clear = clear;

/////////////////////////////////////////////////
//---------------------SVG---------------------//
/////////////////////////////////////////////////

function svg() {
  return (
    src("src/svg/*.svg")
      /*.pipe(glp.svgmin({
      plugins: [{
        cleanupNumericValues: {
          floatPrecision: 0
        }
      }],
      js2svg: {
        pretty: true
      }
    }))
    .pipe(glp.cheerio({
      run: function ($) {
        // $('[fill]').removeAttr('fill');
        // $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
        $('[style]').removeAttr('opacity');
      },
      parserOptions: {
        xmlMode: false
      }
    }))*/
      .pipe(glp.replace("&gt;", ">"))
      .pipe(
        glp.svgSprite({
          mode: {
            symbol: {
              sprite: "../sprite.svg",
              render: {
                scss: {
                  dest: "../_sprite.scss",
                  template:
                    "src/sass/global/helpers/sprite/_sprite_template.scss",
                },
              },
            },
          },
        })
      )
      .pipe(
        gulpIf(
          "*.scss",
          dest("./src/sass/global/helpers/sprite"),
          dest("./build/img/sprite")
        )
      )
  );
};

exports.svg = svg;

function svg_base() {
  return src("src/svg/*.svg")
    .pipe(
      svgcss({
        fileName: "css-sprite",
        cssPrefix: "icon-",
        addSize: false,
      })
    )
    .pipe(dest("src/sass/global/sprite"));
};

exports.svg_base = svg_base;

/////////////////////////////////////////////////
//--------------------font-gen-----------------//
/////////////////////////////////////////////////

/*function fontgen() {
  return src("src/files/fontraw/*.{ttf,otf,woff}")
    .pipe(fontgen({
    dest: "src/files/fonts"
    }))
    .on('end', function() {
    del(['src/files/fonts/*.{svg,eot,css,ttf}']) // exclude this files files
    })
  };

exports.fontgen = fontgen;
*/

/////////////////////////////////////////////////
//---------------------FTP---------------------//
/////////////////////////////////////////////////

//function deploy() {
//return src('build/**')
//.pipe(rsync({
//root: 'build/',
//hostname: 'zagainov@dev.ttcsoft.ru',
//port: 3722,
//destination: '/storage/www/ttcsoft/docs/dev.ttcsoft.ru/html/truetuning',
//include: ['*.htaccess'], // Includes files to deploy
//exclude: ['**/Thumbs.db','**/*.DS_Store'], // Excludes files from deploy
//recursive: true,
//archive: true,
//silent: false,
//compress: true
//}))
//};

//exports.deploy = deploy;

/////////////////////////////////////////////////
//--------------------COPY---------------------//
/////////////////////////////////////////////////

function copy() {
  return src(["src/files/**/*", "!src/files/fontraw/**"]) // exclude raw font file
    .pipe(dest("build/"));
};

//exports.copy = copy;

/////////////////////////////////////////////////
//---------------------DEL---------------------//
/////////////////////////////////////////////////

function remove(done) {
  del("build");
  done();
};

exports.remove = remove;

/////////////////////////////////////////////////
//--------------------WATCH--------------------//
/////////////////////////////////////////////////

function observe() {
  watch("src/pug/**/*.pug", series("pug"));
  watch(["src/sass/**/*.scss", "src/pug/**/*.scss"], series("sass"));
  watch("src/js/**/*.js", series("scripts"));
  watch("src/img/**/*", series("img"));
  watch("src/upload/**/*", series("imgUpload"));
  watch("src/svg/**/*.svg", series("svg"));
};

exports.observe = observe;

/////////////////////////////////////////////////
//--------------------SERVE--------------------//
/////////////////////////////////////////////////

function serve() {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
};

exports.serve = serve;

/////////////////////////////////////////////////
//-------------------DEFAULT-------------------//
/////////////////////////////////////////////////

exports.default = series(
  parallel(copy, img, imgUpload, svg),
  parallel(pug, scripts_libs, scripts, sass),
  parallel(observe, serve)
);

/////////////////////////////////////////////////
//--------------------BUILD--------------------//
/////////////////////////////////////////////////

exports.build = series(
  remove,
  parallel(copy, img, imgUpload, svg),
  parallel(pug, scripts_libs, scripts, sass)
);

