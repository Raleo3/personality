var gulp = require("gulp"),
	watch = require("gulp-watch"),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssvars = require("postcss-simple-vars"),
	nested = require("postcss-nested");


gulp.task("html", function () {
	console.log("something");
});

gulp.task("styles", function () {
	return gulp.src("./app/assets/styles/styles.css")
		.pipe(postcss([cssvars, nested, autoprefixer]))
		.pipe(gulp.dest("./app/static/styles"));
});

gulp.task("babelify", function () {
	return gulp.src("./app/assets/scripts/scripts.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest("./app/static/scripts"));
});

gulp.task("watch", function () {

	watch("./app/index.html", function () {
		gulp.start("html");
	});

	watch("./app/assets/styles/**/*.css", function () {
		gulp.start("styles");
	});

	watch("./app/assets/scripts/**/*.js", function () {
		gulp.start("babelify");
	});
});

