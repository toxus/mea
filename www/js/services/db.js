/**
 * handling the database and sync definition
 *
 * localDb and remoteDB are declared in app.js as global variables
 *
 */
angular.module('app')
 .factory('db', ['$log', 'user', function($log, user) {
    this.isConnected = false;
    this.local = {};
    this.remote = {};

    return {
      connect : function() {
        this.local = new PouchDB('');
        $log.log('Connecting remote: ', user.remoteDbUrl());
        this.remote = new PouchDB(user.remoteDbUrl());
        this.local.sync(this.remote, { live: true});
        this.isConnected = true;
      },
      disconnect : function() {
        remoteDb = {};
      }
    }
  }]);
