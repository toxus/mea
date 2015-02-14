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
  .factory('popup', ['$ionicPopup', '$translate', 'util', 'toastr', function($ionicPopup, $translate, util, toastr) {
    return {
      _translateMsg : function(message, params) {
        var msg = $translate.instant(message);
        for (var param in params) {
          if (params.hasOwnProperty(param)) {
            var p = $translate.instant(params[param])
            msg = msg.replaceAll(param, p);
          }
        }
        return msg;
      },

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
        var alertPopup = $ionicPopup.alert({
          title: $translate.instant(util.isDefined(title) ? title : MSGBOX_TITLE),
          template: this._translateMsg(message, params),
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
      },
      confirm : function(message, title, params) {
        var confirmPopup = $ionicPopup.confirm({
          title: $translate.instant(util.isDefined(title) ? title : MSGBOX_TITLE),
          template: this._translateMsg(message, params),
          okText : $translate.instant('OK'),
          cancelText : $translate.instant('Cancel')
        });
        return confirmPopup;
      },
      /**
       * show a toaster message to the user
       * @param type      success|info|error|warning
       * @param message   html message
       * @param params    key=>value pairs to be translated
       * @param options   toaster options. See: https://github.com/Foxandxss/angular-toastr
       */
      toastr : function(type, message, params, title, options) {
        var msg = this._translateMsg(message, params);
        var title = $translate.instant(util.isDefined(title) ? title : '');
        if (!util.isDefined(options)) {
          options = {
            allowHtml : true,
            positionClass: 'toast-bottom-full-width'
          };
        }
        switch (type) {
          case 'error'    : toastr.error(msg, title, options ); break;
          case 'warning'  : toastr.warning(msg, title, options ); break;
          case 'success'  : toastr.success(msg, title, options ); break;
          default : toastr.info(msg, title, options ); break;
        }
      }

    }
  }]);