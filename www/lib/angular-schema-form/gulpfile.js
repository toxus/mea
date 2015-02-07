/**
 * https://www.npmjs.com/package/gulp-angular-templatecache
 * merge templates into chac
 */

var gulp = require("gulp");
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('default', function () {
  console.log('merge html');
  gulp.src('src/directives/decorators/ionic/*.html')
    .pipe(templateCache({
      root: 'directives/decorators/ionic/',
      module : 'schemaForm'
    }))
    .pipe(gulp.dest('temp'));

  del(['dist/ionic-decorator.js','dist/ionic-decorator.min.js']);

  console.log('merging definition');
  gulp.src(['temp/templates.js', 'src/directives/decorators/ionic/ionic-decorator.js'])
    .pipe(concat('ionic-decorator.js'))
    .pipe(gulp.dest('dist'));

  console.log('compress');
  gulp.src('dist/ionic-decorator.js')
     .pipe(uglify())
     .pipe(concat('ionic-decorator.min.js'))
     .pipe(gulp.dest('dist'));

});