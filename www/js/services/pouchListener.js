/**
 * Created by jaap on 10-01-15.
 */

angular.module('app')
  .factory('PouchListener', ['$rootScope', '$log', function($rootScope, $log) {

    var listeners = [];

    function startChanges(options) {
      localDB.changes({
        continuous: true,
        since: options.since,

        onChange: function (change) {
          if (change.deleted) {
            // $log.info('delete.');
            $rootScope.$apply(function () {
              $rootScope.$broadcast(options.event + '.delete', change.id);
            });
          }
        }

      })
        .on('create', function (evtInfo) {
          $rootScope.$apply(function () {
            // $log.info('add:', evtInfo);
            localDB.get(evtInfo.id, function (err, doc) {
              $rootScope.$apply(function () {
                if (err) console.log(err);
                $rootScope.$broadcast(options.event +'.create', doc);
              })
            });
          });
        })
        .on('update', function (evtInfo) {
          $rootScope.$apply(function () {
            localDB.get(evtInfo.id, function (err, doc) {
              if (doc.type==options.type) {
                $log.info('update:', evtInfo);
                $rootScope.$apply(function () {
                  if (err) console.log(err);
                  $log.log('broadcast', options.event +'.update');
                  $rootScope.$broadcast(options.event +'.update', doc);
                })
              };
            });
          });
        });
    };

    return {
      /*
          defines the events to send on change. Returns the name of the listener to reset
      */
      addListener : function(definition) {
        var options = {
          type : definition.type ? definition.type : false,         // type in the document
          since: definition.since ? definition.since : 'now',       // last event listening for
          event: definition.event ? definition.event : 'change'     // event send as [definition.event].create, .update .delete
        };
        startChanges(options);
      },
      removeListener : function(name) {
        $log.warn('Removing of pouch listener is not supported');
      }
    };
  }]);
