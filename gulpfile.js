"use strict";

const gulp = require('gulp');
const pump = require('pump');

gulp.task('copy',function(cb){
	pump([
			gulp.src(['**/dist/*+(.js|.css)','!(node_modules|docs|lib)/**/dist/*+(.js|.css)','!**/node_modules/**/dist/*+(.js|.css)']),
			gulp.dest('docs/demo/')
		],cb);
});