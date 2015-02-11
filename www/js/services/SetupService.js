/**
 * SetupService
 * Setting the system into style the first time
 *
 * version 0.01 jvk 2015.02.11
 */
angular.module('app')
  .service('SetupService', ['$log',  '$location', 'db', 'util', 'popup',
    function($log, $location, db, util, popup) {

    return {
      /**
       * load the script into the database
       */
      load : function() {
        $log.log('start loading');

        db.eraseAll().then(function() {
          $log.log('remove db information');
          var info = [
            {
              _id : 'user-ma',            // unique id
              type: 'user',               // type of system user
              role: 'mother',             // there is only one mother
              name : 'Maxima',           // default name if not role used
              userId : 'contact-1'        // id of the user to use
            },
            {
              _id : 'user-pa',            // unique id
              type: 'user',               // type of system user
              role: 'father',             // there is only one mother
              name : 'Willem',           // default name if not role used
              userId : 'contact-2'        // id of the user to use
            },
            {
              _id : 'user-ma',            // unique id
              type: 'user',               // type of system user
              role: 'mother',             // there is only one mother
              name : 'Maxima',           // default name if not role used
              userId : 'contact-1'        // id of the user to use
            },


            {
              _id : 'contact-1234',
              type: 'contact',
              name: [
                {value : 'Jaap van der Kreeft'}
              ],
              telephone : [
                {value: '06-10810547'}
              ]
            }
          ];
          db.bulkAdd(info).then(function() {
            $log.log('Information loaded');
            popup.alert('The database has been restored').then(function() {
              $location.path('#/');
            });
          })
        });
        $log.log('end loading');
      }
    };
  }]);

