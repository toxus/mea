/**
 * popups and alerts translated into system language
 * @type {string}
 */

var MSGBOX_TITLE = 'Mea';

String.prototype.replaceAll = function(replace_what, replace_with) {
  var oldstring = this;
  while (true) {
    var newstring = oldstring.replace(replace_what, replace_with);
    if (newstring === oldstring) return oldstring;
    oldstring = newstring;
  }
};
angular.module('app')
  .factory('popup', ['$ionicPopup', '$translate', 'util', function($ionicPopup, $translate, util) {
    return {
      /**
       * alert the user in a translated message
       *
       * @param message   message with params
       * @param title     title of the message box or MSGBOX_TITLE
       * @param params    array of key => value with parameter to translate
       * @returns promise
       */
      alert: function (message, title, params) {
        if (!util.isDefined(params)) {
          params = {};
        }
        var msg = $translate.instant(message);
        for (var param in params) {
          if (params.hasOwnProperty(param)) {
            var p = $translate.instant(params[param])
            msg = msg.replaceAll(param, p);
          }
        }
        var alertPopup = $ionicPopup.alert({
          title: $translate.instant(util.isDefined(title) ? title : MSGBOX_TITLE),
          template: msg,
          okText : $translate.instant('OK')
        });
        return alertPopup;
      },
      /**
       * simple version of the alert displaying an error, with translate and merge
       *
       * @param message
       * @param params
       * @returns {promise}
       */
      error : function(message, params) {
        return this.alert(message, 'Error', params);
      }
    }
  }]);