// importamos gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');

var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var concat = require("gulp-concat");


//------------------------

// variables de patrones de archivos
var jsFiles = ["src/js/*.js", "src/js/**/*.js"];


// definimos tarea por defecto
gulp.task("default", ["concat-js", "compile-sass"], function(){

    // iniciar BrowserSync
    browserSync.init({
        server: "./", // levanta servidor web en carpeta actual
        //proxy: "127.0.0.1:8000",  // actúa como proxy enviando las peticiones a sparrest
        browser: "google chrome"
    });

    // observa cambios en archivos SASS y ejecuta la tarea de compilación
    gulp.watch("src/scss/*.scss", ["compile-sass"]);

    // observa cambios en archivos HTML y recargue el navegador
    gulp.watch("*.html").on("change", browserSync.reload);

    // observar cambios en archivos JS para concatenar
    gulp.watch(jsFiles, ["concat-js"]);
    // observa cambios en archivos JS y recargue el navegador
    gulp.watch("*.js").on("change", browserSync.reload);

});
// source and distribution folder
var
    source = 'src/',
    dest = 'dist/';
    
// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };

// Bootstrap fonts source
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };

// Our scss source folder: .scss files
var scss = {
    in: source + 'scss/style.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

// -----------------------
// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});
//------------------------



// compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(scss.in)
        .pipe(sass(scss.sassOpts))
        .pipe(gulp.dest(scss.out));
});
//-------------------------
// default task
// gulp.task('default', ['sass'], function () {
//      gulp.watch(scss.watch, ['sass']);
// });
//-------------------------


// // definimos tarea por defecto
// gulp.task("default", function(){
//     //Iniciamos browsersync
//     browserSync.init({
//         server: "./", //levanta un servidor web en la carpeta actual
//         browser: "google chrome"
//     });
//     //Observa cambios y ejecuta la tarea
//     gulp.watch("./src/scss/*.scss", ["sass"]); 
//     gulp.watch("./src/scss/*.scss").on("change", browserSync.reload); 
//     //Observa cambios en HTML y recarga el navegador
//     gulp.watch("./*.html").on("change", browserSync.reload);

// });
//definimos tarea gulp-sass para compilar sass

gulp.task("compile-sass", function(){
    gulp.src("./src/scss/style.scss") // cargamos le archivo
    .pipe(sourcemaps.init()) // comenzamos la captura de sourcemaps
    .pipe(sass().on('error', sass.logError)) // compilamos el archivo SASS
    .pipe(postcss([
        autoprefixer(), // autoprefija automáticamente el CSS
        cssnano() // minifica el CSS
    ]))
    .pipe(sourcemaps.write('./')) // escribimos los sourcemaps
    .pipe(gulp.dest("./dist/css/")) // guardamos el archivo en dist/css
    .pipe(notify({
        title: "SASS",
        message: "Compiled 🤘"
    }))
    .pipe(browserSync.stream());
});

// // definimos la tarea para concatenar JS
// gulp.task("concat-js", function(){
//     gulp.src(jsFiles)
//     .pipe(sourcemaps.init()) // comenzamos la captura de sourcemaps
//     .pipe(tap(function(file){ // tap nos permite ejecutar un código por cada fichero seleccionado en el paso anterior
//        file.contents = browserify(file.path).bundle(); // pasamos el archivo por browserify para importar los require
//     }))
//     .pipe(buffer()) // convertir cada archivo en un stream
//     .pipe(uglify()) // minifica el javascript
//     .pipe(sourcemaps.write('./')) // escribimos los sourcemaps
//     .pipe(concat("app.js"))
//     .pipe(gulp.dest("./dist/js/"))
//     .pipe(notify({
//         title: "JS",
//         message: "Concatenated 🤘"
//     }))
//     .pipe(browserSync.stream());
// });
// definimos la tarea para concatenar JS



gulp.task("concat-js", function(){
    gulp.src(jsFiles)
    .pipe(tap(function(file){ // tap nos permite ejecutar un código por cada fichero seleccionado en el paso anterior
        file.contents = browserify(file.path, {debug:true}).bundle(); // pasamos el archivo por browserify para importar los require
    }))
    .pipe(buffer()) // convertir cada archivo en un stream
    .pipe(gulp.dest("./dist/js/"))
    .pipe(notify({
        title: "JS",
        message: "Concatenated 🤘"
    }))
    .pipe(browserSync.stream());
});