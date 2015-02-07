/**
 * information about the current user
 */

angular.module('app')
  .factory('user', function($q, $timeout) {

    var currentUser = {
      name : 'jaap',
      email: 'jaap@toxus.nl',

      remoteDbUrl : 'http://www.mea.today/address'
    };

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

        $timeout(function() {
          deferred.resolve();
        }, 1000);
        return deferred.promise;
      },
      /**
       * the url the system syncs with. Is the same for one family
       */
      remoteDbUrl : function() {
        return currentUser.remoteDbUrl;
      }
    };
  });

