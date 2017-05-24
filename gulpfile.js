var gulp = require("gulp"),
	watch = require("gulp-watch"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssvars = require("postcss-simple-vars"),
	mixins = require("postcss-mixins"),
	nested = require("postcss-nested"),
	cssImport = require("postcss-import"),
	webpack = require("webpack"),
	browserSync = require('browser-sync').create();


gulp.task("styles", function () {
	return gulp.src("./app/assets/styles/styles.css")
		.pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
		.on("error", function (errorInfo) {
			console.log(errorInfo.toString());
			this.emit("end");
		})
		.pipe(gulp.dest("./app/static/styles"));
});

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

gulp.task("cssInject", ['styles'], function () {
	return gulp.src("./app/static/styles/styles.css")
		.pipe(browserSync.stream());
});

gulp.task("jsReload", ['scripts'], function () {
	browserSync.reload();
});
