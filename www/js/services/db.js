/**
 * handling the database and sync definition
 *
 * localDb and remoteDB are declared in app.js as global variables
 *
 */
angular.module('app')
 .factory('db', function(user) {
    return {
      connectRemote : function() {
        remoteDB = new PouchDB(user.remoteDbUrl());
        localDB.sync(remoteDB, { live: true});
      },
      disconnectRemote : function() {
        remoteDb = {};
      }
    }
  });