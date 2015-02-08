/**
 * handling the database and sync definition
 *
 * localDb and remoteDB are declared in app.js as global variables
 *
 */
angular.module('app')
 .factory('db', ['$log', 'user', function($log, user) {
    this.local = {};
    this.remote = {};

    return {
      connectRemote : function() {
        $log.log('Connecting remote: ', user.remoteDbUrl());
        this.local = new PouchDB('');
        this.remote = new PouchDB(user.remoteDbUrl());
        console.log('local db:',this.local);
        this.local.sync(this.remote, { live: true});
      },
      disconnectRemote : function() {
        remoteDb = {};
      }
    }
  }]);
