/**
 * handling the database and sync definition
 *
 * localDb and remoteDB are declared in app.js as global variables
 *
 */
angular.module('app')
 .factory('db', ['$log', '$q', '$rootScope', 'util',
                function($log, $q, $rootScope, util) {
    this.isConnected = false;
    this.local = {};
    this.remote = {};
    var _eventlisteners = []; // array of {event: ['insert','update', 'delete'], type: 'text of doc.type', name: 'event name'

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
                  emit(doc.name[0].value.toLowerCase())
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
      _initEvents : function() {
        this.addListener('contact'); // {type:'contact', event: 'contact'});
      },

      connect : function(remoteDbUrl) {
        this.local = new PouchDB('mea');
        this._initDb();
        this._initEvents();
        $log.log('Connecting remote: ', remoteDbUrl);
        this.remote = new PouchDB(remoteDbUrl);
        this.local.sync(this.remote, { live: true});
        this.isConnected = true;
        $rootScope.$broadcast('db:connected');
      },
      disconnect : function() {
        this.isConnected = false;
        $rootScope.$broadcast('db:disconnected');
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
      },

      addListener : function(typeDef) {
        if (_eventlisteners.indexOf(typeDef) >= 0) return; // we are listening
        _eventlisteners.push(typeDef);
        if (_eventlisteners.length == 1) {
          // activate the change reader
          var activeDb = this.local;
          activeDb.changes({
            continuous: true,
            since: 'now',

            onChange: function (change) {
              if (change.deleted) {
                /**
                 * how do we know the type of the delete record????

                $log.info('delete.', change);
                if (util.isDefined(doc.type) && _eventlisteners.indexOf(doc.type) >= 0) {
                  $rootScope.$apply(function () {
                    $rootScope.$broadcast(doc.type + '.delete', change.id);
                  });
                }
                */
              }
            }

          })
            .on('create', function (evtInfo) {
              $rootScope.$apply(function () {
                // $log.info('add:', evtInfo);
                activeDb.get(evtInfo.id, function (err, doc) {
                  if (util.isDefined(doc.type) && _eventlisteners.indexOf(doc.type) >= 0) {
                    $rootScope.$apply(function () {
                      if (err) console.log(err);
                      $rootScope.$broadcast(doc.type + '.create', doc);
                    })
                  }
                });
              });
            })
            .on('update', function (evtInfo) {
              $rootScope.$apply(function () {
                activeDb.get(evtInfo.id, function (err, doc) {
                  if (util.isDefined(doc.type) && _eventlisteners.indexOf(doc.type) >= 0) {
                    $rootScope.$apply(function () {
                      $log.log('broadcast', doc.type + '.update');
                      $rootScope.$broadcast(doc.type + '.update', doc);
                    })
                    return;   // can only be one
                  }
                });
              });
            });
        }
      },
      removeListener : function(name) {
        $log.warn('Removing of pouch listener is not supported');
      },
      eraseAll : function() {
        PouchDB.plugin(Erase);
        return this.local.erase();
      },
      bulkAdd : function(info) {
        return this.local.bulkDocs(info);
      }
    }
  }]);
