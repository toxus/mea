/**
 * AppController defines how the app functions.
 *
 */


angular.module('app')
  .controller('AppController', ['$scope', '$log', '$ionicHistory', '$timeout','user',
            function($scope, $log, $ionicHistory, $timeout, user) {
    var _vm = this;

    /**
     * implementation of the back button
     */
    this.goBack = function() {
      $ionicHistory.goBack();
    };

    /**
     * submitting a form with a button, not part of that form
     *
     * problem: button is outside the form, so there is the normal load won't work
     * fix: press the (hidden) submit button on the form
     */
    this.submitForm = function(buttonId) {
      var v = document.getElementById(buttonId);
      if (v) {
        $timeout(function () { // must finish the $apply
          v.click();
        }, 10);
      } else {
        $log.error('The ' + buttonId + ' could not be found as button in the form');
      }
    }

    $log.log('start listening');
    this.user = user.user();
    $scope.$on('user:update', function(event, data) {
      $log.log('get current user', data);
      _vm.user = data;
    });

  }]);