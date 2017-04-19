'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const prefixer = require('gulp-autoprefixer');

gulp.task('css',function(){
	return gulp.src('src/*.scss')
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(prefixer({
				browsers: ["last 2 version","> 1%","ff > 10","ie >= 9"],
				cascade: false
			}))
			.pipe(gulp.dest('dist/'));
});
gulp.task('cssWmin',function(){
	return gulp.src('src/*.scss')
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(prefixer({
				browsers: ["last 2 version","> 1%","ff > 10","ie >= 9"],
				cascade: false
			}))
			.pipe(rename(function(path){
				path.basename += '-min' ;
			}))
			.pipe(gulp.dest('dist/'));
});
gulp.task('sass:watch', function(){
	gulp.watch('src/*.scss', ['css',"cssWmin"]);
});