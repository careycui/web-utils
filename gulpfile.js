"use strict";

const gulp = require('gulp');
const pump = require('pump');
const markdown = require('gulp-markdown');
const rename = require('gulp-rename');
const inject = require('gulp-inject-string');

const startH = '<!DOCTYPE html>'+
					'<html>'+
						'<head>'+
							'<meta charset="utf-8">'+
							'<link rel="stylesheet" type="text/css" href="../../asset/sys/sys.min.css">'+
							'<link rel="stylesheet" type="text/css" href="../../asset/markdown/markdown.css">'+
						'</head>'+
						'<body class="markdown-body">';

const endH ='<script src="../../asset/reset_link.js"></script>'+
			'</body></html>';

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
			inject.wrap(startH,endH),
			rename({
				basename: 'api'
			}),
			gulp.dest('docs/demo/')
		],cb);
});
gulp.task('release',['copy', 'markdown']);