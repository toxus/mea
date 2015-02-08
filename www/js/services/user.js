/**
 * information about the current user
 */

angular.module('app')
  .factory('user', ['$q', '$timeout', '$log', '$rootScope',
            function($q, $timeout, $log, $rootScope) {
    this.currentUser = {};
    var _vm = this;

    return {
      /**
       * setup the information about the current user. Should be called before any
       * information is used
       * loads the information from the central server and places it in the currentUser structure
       *
       * @return promise
       *
       */
      init : function() {
        var deferred = $q.defer();
        $log.log('request user.init');
        $timeout(function() {
          _vm.currentUser = {
            name : 'jaap',
            email: 'jaap@toxus.nl',
            remoteDbUrl : 'http://db.mea.today:5984/address'
          };
          $log.log('user.init done')
          $rootScope.$broadcast('user:update', _vm.currentUser);
          deferred.resolve(_vm.currentUser);
        }, 1000);
        return deferred.promise;
      },
      user : function() {
        return _vm.currentUser;
      },
      /**
       * the url the system syncs with. Is the same for one family
       */
      remoteDbUrl : function() {
        return _vm.currentUser.remoteDbUrl;
      }
    };
  }]);

