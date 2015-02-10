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

    /**
     * init the _design interface of the data
     */


    return {
      _initDb : function() {
        var contact = {
          _id: '_design/contact',
          views: {
            byName: {
              map: function (doc) {
                if (doc.type == 'contact') {
                  emit(doc.name[0].value)
                }
              }.toString()
            }
          }
        };
        $log.log('checking structure of pouchDb');
        var db = this.local;
        this.local.get(contact._id).then(function (result) {
          // check changes
          if (!util.isDefined(result.views) ||
              (JSON.stringify(result.views) !== JSON.stringify(contact.views))) {
            $log.log('pouchDb.contact changed');
            result.views = contact.views;
            db.put(result);
          }
        }).catch(function (err) {
          $log.log('pouchDb.contact new');
          db.put(contact);
        });
        $log.log('checking structure of pouchDb, done');
      },
      connect : function() {
        this.local = new PouchDB('');
        this._initDb();
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
       *
       * @param:    type the type string for the doc.type
       * @filter:   false or an object of {value, fields} that defines where to look for the value
       * @returns:  promise
       */
      all : function(type, filterObj, options) {
        if (!util.isDefined(options)) {
          options = {
            include_docs: true
          };
          return $q.when(this.local.query(type + '/byName', options))
            .then(function(result) {
              var converted;
              if (!util.isDefined(filterObj) || filterObj === false ) {
                converted = result.rows.map(function (element) {
                  return element.doc;
                });
              } else {
                var value = filterObj.value.toLowerCase();
                var len = filterObj.fields.length;
                converted = result.rows
                  .filter(function(doc) {
//                    console.log('found:', doc, ', filterObj', filterObj);
                    for (var index = 0; index < len; index++) {
                      var field = filterObj.fields[index];
                      if (util.isDefined(doc.doc[field])) {
                        var test = doc.doc[field][0].value.toLowerCase();
                        if (test.indexOf(value) >= 0) {
                          return true;
                        }
                      }
                    }
                    return false;
                  })
                  .map(function (element) {
                    return element.doc;
                  });
              }
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
        doc._id = util.randomKey(typeName);
        return $q.when(this.local.put(doc));
      }
    }
  }]);
