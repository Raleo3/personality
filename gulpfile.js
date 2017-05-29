var gulp = require("gulp"),
	watch = require("gulp-watch"),
	postcss = require("gulp-postcss"),
	usemin = require("gulp-usemin"),
	rev = require('gulp-rev'),
	del = require("del"),
	uglify = require('gulp-uglify'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require("autoprefixer"),
	cssvars = require("postcss-simple-vars"),
	mixins = require("postcss-mixins"),
	nested = require("postcss-nested"),
	cssImport = require("postcss-import"),
	webpack = require("webpack"),
	browserSync = require('browser-sync').create();


gulp.task("deleteDistFolder", function () {
	return del("./dist");
});

gulp.task("previewDist", function () {
	browserSync.init({
		server: {
			baseDir: "dist"
		}
	});
});

// Compiles PostCSS/SCSS modules into single CSS file
gulp.task("styles", function () {
	return gulp.src("./app/assets/styles/styles.css")
		.pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
		.on("error", function (errorInfo) {
			console.log(errorInfo.toString());
			this.emit("end");
		})
		.pipe(gulp.dest("./app/temp/styles"));
});

// Runs webpack Module loader to bundle fresh js files according to config
gulp.task("scripts", function (callback) {
	webpack(require('./webpack.config.js'), function (err, stats) {
		if (err) {
			console.log(err.toString());
		}

		console.log(stats.toString());
		callback();
	});
});

gulp.task("watch", function () {

	// Dev Server on Gulp Watch
	browserSync.init({
		server: {
			baseDir: "app"
		}
	});

	// Auto refresh on any change to HTML
	watch("./app/index.html", function () {
		browserSync.reload();
	});

	watch("./app/assets/styles/**/*.css", function () {
		gulp.start("cssInject");
	});

	watch("./app/assets/scripts/**/*.js", function () {
		gulp.start("jsReload");
	});
});

// Auto refreshes dev server on all CSS file Changes
gulp.task("cssInject", ['styles'], function () {
	return gulp.src("./app/temp/styles/styles.css")
		.pipe(browserSync.stream());
});

// Auto refreshes dev server on all JS file Changes
gulp.task("jsReload", ['scripts'], function () {
	browserSync.reload();
});

gulp.task("useminTrigger", ["deleteDistFolder"], function() {
	gulp.start("usemin");
});

// Deletes Dist Folder, Revisions, and Compresses JS & CSS bundle files, sending new PROD-ready versions to Dist folder
gulp.task('usemin', ['styles', 'scripts'], function() {
  return gulp.src("./app/index.html")
    .pipe(usemin({
      css: [function() {return rev()}, function() {return cssnano()}],
      js: [function() {return rev()}, function() {return uglify()}]
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("build", ["deleteDistFolder", "useminTrigger"]);


