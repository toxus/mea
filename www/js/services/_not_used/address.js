/**
 * Created by jaap on 10-01-15.
 */
'use strict';

angular.module('starter')

  .factory('Address', ['$q', '$rootScope', 'rfc4122', function($q, $rootScope, rfc4122) {


    return {
      // http://www.mircozeiss.com/building-offline-applications-with-angularjs-and-pouchdb/
      all: function () {
        var deferred = $q.defer();
        var allAddress = function(doc) {
          if (doc.name) {
            emit(doc.name);
          }
        };
        localDB.query(
          {map:allAddress},
          {reduce: false,
           include_docs : true
          },
          function(err, response) {
            $rootScope.$apply(function() {
              if (err) {
                deferred.reject(err);
              } else {
                if (!response.rows.length) {  // nothing found so empty set
                  deferred.resolve([]);
                } else {
                  deferred.resolve(response);
                }
              }
            })
          }
        );
        return deferred.promise;
      },
      get : function(id) {
        var deferred = $q.defer();
        localDB.get(id, function (err, doc) {
            if (err) {
              deferred.reject(err, doc);
            } else {
              $rootScope.$apply(function () {
                deferred.resolve(doc);
              });
            }
          });
        return deferred.promise;
      },
      put : function(doc) {
        var deferred = $q.defer();
        /* set default values for the doc */
        doc.lastChanged = new Date().getTime(); // timestamp of the change
        if (!doc.type) {            // always have a type
          doc.type = 'unknown';
        }
        if (!doc._id) {
          doc._id = rfc4122.v4();
        }

        localDB.put(doc, function (err, doc) {
          if (err) {
            if (err.status == 409) {// conflict
               $log.warn('Conflict on update', err);
            } else {
              $log.error('Error updating info:', err);
            }
            deferred.reject(err);
          } else {
            $rootScope.$apply(function () {
              deferred.resolve(doc);
            });
          }
        });
        return deferred.promise;
      }
    }
  }]);