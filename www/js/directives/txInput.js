/**
 * general purpose input with label
 */
angular.module('app')
  .directive('txInput', function() {
    return {
      restrict : 'AE',
      scope: {
        body : '@'
      },
      template: '<div class="tx-content">{{ body }}</div>'
    }
  });
