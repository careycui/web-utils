'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

gulp.task('css',function(){
	return gulp.src('src/*.scss')
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(gulp.dest('dist/'));
});
gulp.task('cssWmin',function(){
	return gulp.src('src/*.scss')
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(rename(function(path){
				path.basename += '-min' ;
			}))
			.pipe(gulp.dest('dist/'));
});
gulp.task('sass:watch', function(){
	gulp.watch('src/*.scss', ['css']);
});