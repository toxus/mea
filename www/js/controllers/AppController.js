
angular.module('app')
  .controller('AppController', ['$scope', '$log', '$ionicHistory', 'user', function($scope, $log, $ionicHistory, user) {
    var _vm = this;
    this.user = {
      name : '...'
    };

    this.goBack = function() {
      $ionicHistory.goBack();
    };
    $log.log('start listening');
    this.user = user.user();
    $scope.$on('user:update', function(event, data) {
      $log.log('get current user', data);
      _vm.user = data;
    });

  }]);