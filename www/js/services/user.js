/**
 * information about the current user
 * It defines the user and it's relation to the outside world. So who you are is part of this
 *
 *
 */

angular.module('app')
  .factory('user', ['$q', '$timeout', '$log', '$rootScope', 'db',
            function($q, $timeout, $log, $rootScope, db) {
    this._stateExplain = {
      // id the user._id in the document
      _id: 'user-948474',
      // the user record stored in the db, loaded at runtime
      user : {},
      // the calendar the user is currently looking at. V1: there is only 1
      calendarId : 'calendar-1',
      // the calender record loaded
      calendar : {},
      // the url to sync with. It's the gezinsagenda. Return by the server.
      remoteDbUrl : 'http://db.mea.today:5984/address',

      // the name used to display in events, etc
      name : 'Jaap',
      // the email address used to login. It's private, not shown
      email: 'jaap@toxus.nl',
      // if user is Admin all options are active
      isAdmin : false,
      // if true the develop menu is active
      isDeveloper : true,
      // defines the calendar we are looking at
      calendar : {
        // the users that have their own agenda
        users : [
          {
            // the user.id that holds the information about the agenda user
            id   : 'user-93378'
          }
        ]
      }
    };


    var onDbConnect = $rootScope.$on('db:connected', function(event) {
      // check that there is an user record
      $log.log('user: get current user record');
      db.local.get(_vm.currentUser.id).then(function(doc) {

      }).catch(function(err) {

      });
    });

    this.currentUser = {};
    var _vm = this;

    return {
      /**
       * setup the information about the current user.
       * Loads the information from the central server and places it in the currentUser structure
       * We can not yet access the db, because it needs this information for the remote database
       *
       * @return promise
       */
      init : function() {
        var deferred = $q.defer();
        $log.log('request user.init');
        $timeout(function() {
          _vm.currentUser = _vm._stateExplain;
          $rootScope.$broadcast('user:update', _vm.currentUser);
          deferred.resolve(_vm.currentUser);
        }, 1000);
        return deferred.promise;
      },
      user : function() {
        return _vm.currentUser;
      },
      current : function() {
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

