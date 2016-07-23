// importamos gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();


//------------------------
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
gulp.task('default', ['sass'], function () {
     gulp.watch(scss.watch, ['sass']);
});
//-------------------------


// definimos tarea por defecto
gulp.task("default", function(){
	//Iniciamos browsersync
	browserSync.init({
		server: "./", //levanta un servidor web en la carpeta actual
		browser: "google chrome"
	});
	//Observa cambios y ejecuta la tarea
	gulp.watch("./src/scss/*.scss", ["compile-sass"]); 
	//Observa cambios en HTML y recarga el navegador
	gulp.watch("./*.html").on("change", browserSync.reload); 

});
//definimos tarea gulp-sass para compilar sass

gulp.task("compile-sass", function(){
    gulp.src("./src/scss/style.scss") // cargamos le archivo
    .pipe(sass().on('error', sass.logError)) // compilamos el archivo SASS
    .pipe(gulp.dest("./dist/css/")) // guardamos el archivo en dist/css
    .pipe(notify({
        title: "SASS",
        message: "Compiled 🤘"
    }))
    .pipe(browserSync.stream());
});