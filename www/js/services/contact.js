angular.module('app')
  .factory('contact', ['$q','$log', '$timeout', '$rootScope', 'util', function($q, $log, $timeout, $rootScope, util) {

    this.tmpUsers = [
      {
        _id: '1234-14593-1938-138',
        name: [
          {value: 'Jaap van der Kreeft'}
        ],
        telephone: [
          {value: '0610810547'},
          {value: '0123-01231', label: 'work'}
        ],
        email: [
          {value: 'jaap@toxus.nl'},
        ]
      },
      {
        _id: '1234-985039-038-193',
        'name': [
          {value: 'Klaas Mantje'}
        ]
      }
    ];
    // definition of the fields used for view and edit

    this.fields = {
      name : {                // field is store as name: {value: 'xxx', caption: 'yyyy', other: 'zzzz' }
        labels      : ['name'],
        icon        : 'ion-person',
        type        : 'string',
        isMaster    : true,
        isArray     : false,      // only one name allowed
        isRequired    : true,
        showOn      : ['insert', 'update'],      // when to show. If not it's placed in optional list
        validationMessage: {
          "default": "The name is required"
        }
      },
      telephone : {
        labels  : ['telephone', 'mobile', 'work'],
        icon    : 'ion-android-call',
        isArray : false,      // only one name allowed
        type    : 'string'
      },
      email: {
        labels  : ['email', 'public', 'private'],
        icon    : 'ion-android-mail',
        isArray : false,      // only one name allowed
        type    : 'string',
        html5type : 'email',
        validationMessage: {
          "default": "Email address is not valid"
        }
      },
      location : {
        label   : ['home', 'work'],
        isArray : false,      // only one name allowed
        icon    : 'ion-android-pin'
      }
    };
    var _vm = this;

    /**
     * returns the label from the dataField if exist otherwise fields[fieldIndex].labels the first
     * if no labels defined it return fieldIndex
     * @param dataField
     * @param fieldIndex
     * @private
     */
    function _labelFromDef(dataField, fieldIndex) {
      if (typeof dataField.label !== 'undefined') {
        return dataField.label;
      } else if (typeof _vm.fields[fieldIndex].labels !== 'undefined') {
        if (typeof _vm.fields[fieldIndex].labels === 'string') {
          return _vm.fields[fieldIndex].labels;
        } else {
          return _vm.fields[fieldIndex].labels[0];
        }
        return fieldIndex;
      }
    }

    return {
      all : function() {
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(_vm.tmpUsers);
        }, 10);

        return deferred.promise;
      },
      get : function(id) {

        var deferred = $q.defer();
        $timeout(function() {
          //$log.info('looping',_vm.tmpUsers.length);
          for (var index = 0, len = _vm.tmpUsers.length; index < len; ++index) {
            if (_vm.tmpUsers[index]._id == id) {
              deferred.resolve(_vm.tmpUsers[index]);
              return;
            }
          };
          //$log.info('NOT found', _vm.tmpUsers, id);
        }, 10);

        return deferred.promise;
      },
      fields : function(cnt) {
        var result = [];
        $log.log('fields');
        return Array.prototype.slice.call(cnt);
      },
      caption : function(cnt) {
        return util.isDefined(cnt.name) ? cnt.name[0].value : 'no name';
      },
      /**
       * returns the array of fields to edit in the order
       *   - value
       *   - label
       *   - icon
       *   - format     (to display with dates)
       *   - isMaster   (name to search on currently)
       *
       */
      viewFields : function(data) {
        var result = [];
        for (var def in data) {
          if (data.hasOwnProperty(def)) { // should not read other properties
            if (typeof _vm.fields[def] !== 'undefined') { // we know this type of field
              for (var index in data[def]) {                  // every field is data repetative, telephone
                var f = data[def][index];
                /*
                var lbl;
                if (typeof f.label === 'undefined') {
                  if (_vm.fields[def].labels === 'undefined') {
                    lbl = def;
                  } else {
                    lbl = _vm.fields[def].labels[0]
                  }
                } else {
                  lbl = f.label;
                }
                */
                var item = {
                  value :  f.value,
                  label : _labelFromDef(f, def), //lbl,
                  icon  : _vm.fields[def].icon,
                  format : typeof _vm.fields[def].format === 'undefined' ? '' : _vm.fields[def].format
                }
                item.isMaster = typeof _vm.fields[def].isMaster === 'undefined' ? false : _vm.fields[def].isMaster;
                result.push(item);
              }
            }
          }
        }
//        $log.info('convert', result);
        return result;
      },
      /**
       * read the information from contact and put them so jsonForm can handle it
       */
      model : function(data) {
        var result = [];
        for (var def in data) {
          if (data.hasOwnProperty(def)) {
            if (typeof _vm.fields[def] !== 'undefined') { // field is editable
              var f = data[def];
              var item = {};
              if (!f.isArray) {
                result[def] = f[0].value
              } else {
                $log.warning('contact.model: the array fields are not implemented');
              }
            }
          }
        }
        return result;
      },
      /**
       * convert the current information into the json form definition
       */
      jsonForm : function() {
        return util.jsonForm(_vm.fields);
      }
    };
  }]);

