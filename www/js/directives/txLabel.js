angular.module('app')
  .directive('txLabel', function() {
    return {
      restrict : 'AE',
      scope: {
        caption : '@'
      },
      template: '<div class="tx-label">{{ caption | translate }}:</div>'
    }
  });
