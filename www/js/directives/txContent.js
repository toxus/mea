/**
 * in the view: show the content of the field
 *
 */
angular.module('app')
  .directive('txContent', function() {
    return {
      restrict : 'AE',
      scope: {
        body : '@'
      },
      template: '<div class="tx-content">{{ body }}</div>'
    }
  });

