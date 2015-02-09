/**
 * handling the database and sync definition
 *
 * localDb and remoteDB are declared in app.js as global variables
 *
 */
angular.module('app')
 .factory('db', ['$log', '$q', 'rfc4122', 'user', 'util', function($log, $q, rfc4122, user, util) {
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
      },

      /***
       * used: http://jsfiddle.net/yoorek/2zt27/1/
       * as example to create promises from the function calls
       */
      all : function(options) {
        if (!util.isDefined(options)) {
          options = {
            include_docs: true
          };
          return $q.when(this.local.allDocs(options))
            .then(function(result) {
              var converted;
              converted = result.rows.map(function(element) {
                return element.doc;
              });
              return converted;
            });
        }
      },
      /**
       * retrieves the doc by it's docId
       * @param docId       the id
       * @param options     see PouchDB documentation
       * @returns {Promise}
       */
      get : function(docId, options) {
        if (!util.isDefined(options)) {
          options = {};
        }
        return $q.when(this.local.get(docId, options))
      },
      /**
       * stores a document in the database by the _id and _rev stored in the doc
       * @param doc       the document to save
       * @param typename  if defined && not false it's creates a new object with for this type
       * @returns {Promise}
       */
      put : function(doc) {
        if (doc === false) {
          return $q.when(true);        // just return true
        } else {
          return $q.when(this.local.put(doc));
        }  
      },
      /**
       * create a new doc in the database with the given type
       * @param doc         the document to store
       * @param typeName    the type of the document
       * @returns {Promise}
       */
      add : function(doc, typeName) {
        doc.type = typeName;
        doc._id = rfc4122.v4()
        return $q.when(this.local.put(doc));
      }
    }
  }]);
