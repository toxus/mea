/**
 * global util functions
 */
angular.module('app')
  .factory('util', [function() {
    return {
      isDefined : function(obj){
        return typeof obj !== 'undefined';
      }
    }
  }]);