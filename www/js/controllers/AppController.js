
angular.module('app')
  .controller('AppController', function($scope, $log, $ionicHistory) {
    var _vm = this;

    this.goBack = function() {
      $ionicHistory.goBack();
    };
  });