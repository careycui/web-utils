"use strict";

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');

gulp.task('copy',function(cb){
	pump([
			gulp.src("src/*.js"),
			gulp.dest('dist')
		], cb);
});
gulp.task('uglify',function(cb){
	pump([
			gulp.src('src/*.js'), 
			uglify({
				mangle: false
			}),
			rename(function(path){
				path.basename += '-min' ;
			}),
			gulp.dest('dist')
		], cb);
});
gulp.task('watch', function(){
	gulp.watch('scr/*.js', ['copy', 'uglify']);
});