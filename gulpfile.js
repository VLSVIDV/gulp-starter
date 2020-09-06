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
    // install gulp-plumber and gulp-notify if you want to see beautiful errors in console
  /*.pipe(
      glp.plumber({
        errorHandler: glp.notify.onError(function (err) {
          return {
            title: "PUG error",
            message: err.message,
          };
        }),
      })
    )*/
    .pipe(
      glp.pug({
        pretty: true,
      })
    )
    .pipe(strip())
    .pipe(dest("dist/"))
    .on("end", browserSync.reload);
}

exports.pug = pug; // this is in case of running "pug" as single task. It was task(pug) in gulp 3

/////////////////////////////////////////////////
//--------------------SASS---------------------//
/////////////////////////////////////////////////

function sass() {
  return (
    src("src/sass/style.scss")
      .pipe(glp.sass())
      .pipe(glp.autoprefixer({ grid: "autoplace" }))
      .pipe(gcmq())
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
      .pipe(dest("dist/css"))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

exports.sass = sass;

/////////////////////////////////////////////////
//-------------------SCRIPTS-------------------//
/////////////////////////////////////////////////

function scriptsLibs() {
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
    .pipe(dest("dist/js/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

exports.scriptsLibs = scriptsLibs;

function scripts() {
  return src("src/js/main.js")
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
    .pipe(dest("dist/js/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

exports.scripts = scripts;

/////////////////////////////////////////////////
//---------------------IMG---------------------//
/////////////////////////////////////////////////

// can't dry this functions
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
    .pipe(dest("dist/img"));
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
    .pipe(dest("dist/upload"));
};

exports.imgUpload = imgUpload;

/////////////////////////////////////////////////
//---------------------SVG---------------------//
/////////////////////////////////////////////////

function svg() {
  return (
    src("src/svg/*.svg")
      // install gulp-cheerio if you need this task. be careful - it can remove defs from svg
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
          dest("./dist/img/sprite")
        )
      )
  );
}

exports.svg = svg;

/*function svg_base() {
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

exports.svg_base = svg_base;*/

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
//return src('dist/**')
//.pipe(rsync({
//root: 'dist/',
//hostname: 'user@server.ru',
//port: 3722,
//destination: '/storage/megaproject',
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
    .pipe(dest("dist/"));
}

//exports.copy = copy;

/////////////////////////////////////////////////
//---------------------DEL---------------------//
/////////////////////////////////////////////////

function clear(done) {
  del("dist");
  done();
}

exports.clear = clear;

/////////////////////////////////////////////////
//-----------------CLEAR CACHE-----------------//
/////////////////////////////////////////////////

function clearCache() {
  return glp.cache.clearAll();
}

exports.clearCache = clearCache;

/////////////////////////////////////////////////
//--------------------WATCH--------------------//
/////////////////////////////////////////////////

function observe() {
  watch("src/pug/**/*.pug", series(pug));
  watch(["src/sass/**/*.scss", "src/pug/**/*.scss"], series(sass));
  watch("src/js/**/*.js", series(scripts));
  watch("src/img/**/*", series(img));
  watch("src/upload/**/*", series(imgUpload));
  watch("src/svg/**/*.svg", series(svg));
}

exports.observe = observe;

/////////////////////////////////////////////////
//--------------------SERVE--------------------//
/////////////////////////////////////////////////

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

exports.serve = serve;

/////////////////////////////////////////////////
//-------------------DEFAULT-------------------//
/////////////////////////////////////////////////

exports.default = series(
  parallel(copy, img, imgUpload, svg),
  parallel(pug, scriptsLibs, scripts, sass),
  parallel(observe, serve)
);

/////////////////////////////////////////////////
//--------------------BUILD--------------------//
/////////////////////////////////////////////////

exports.build = series(
  clear,
  parallel(copy, img, imgUpload, svg),
  parallel(pug, scriptsLibs, scripts, sass)
);
