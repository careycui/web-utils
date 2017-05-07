"use strict";

const gulp = require('gulp');
const pump = require('pump');
const markdown = require('gulp-markdown');
const rename = require('gulp-rename');

gulp.task('copy', function(cb){
	pump([
			gulp.src(['**/dist/*+(.js|.css)','!node_modules/**/dist/*+(.js|.css)','!lib/**/dist/*+(.js|.css)','!docs/**/dist/*+(.js|.css)','!**/node_modules/**/dist/*+(.js|.css)']),
			gulp.dest('docs/demo/')
		],cb);
});

gulp.task('markdown', function(cb){
	pump([
			gulp.src(['**/*.md','!node_modules/**/*.md','!docs/**/*.md','!lib/**/*.md','!**/node_modules/**/*.md']),
			markdown({
				highlight: function (code, lang, callback) {
				    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
				      callback(err, result.toString());
				    });
				  }
			}),
			rename({
				basename: 'api'
			}),
			gulp.dest('docs/demo/')
		],cb);
});
gulp.task('release',['copy', 'markdown']);