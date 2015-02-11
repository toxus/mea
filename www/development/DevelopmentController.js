/**
 * development options
 * version 1.0 jvk 2015.02.11
 */
angular.module('app')
  .controller('DevelopmentController', ['$log', 'user', 'SetupService', 'popup',
              function($log, user, SetupService, popup) {
    this.userInfo = [
      {label: "Id", value : user.current()._id },
      {label: "Name", value : user.current().name },
      {label: "Email", value: user.current().email},
      {label: "RemoteDbUrl", value: user.remoteDbUrl()},
      {label: "IsAdmin", value: user.current().isAdmin}
    ];
    /**
     * setup a new enviroment remove the existing one
     */
    this.setup = function() {
      popup.confirm('Do you want to erase the database?').then(function(isOk) {
        if (isOk) {
          $log.log('load new setup');
          SetupService.load();
        }
      });
    }

  }]);
