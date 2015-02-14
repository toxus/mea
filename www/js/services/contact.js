angular.module('app')
  .factory('contact',
              ['$q','$log', '$timeout', '$rootScope', 'util', 'db',
        function($q, $log, $timeout, $rootScope, util, db) {
    /**
     * structure of a contact stored on disk
     * @type {*[]}
    this.tmpUsers = [
      {
        _id: '1234-14593-1938-138',
        type: 'contact',
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
    ];
      */

            // definition of the fields used for view and edit

    this._fields = util.translateForm(
      {
      name : {                // field is store as name: {value: 'xxx', caption: 'yyyy', other: 'zzzz' }
        labels      : ['name'],
        icon        : 'ion-person',
        type        : 'string',
        isArray     : false,      // only one name allowed
        isRequired    : true,
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
        labels   : ['home', 'work'],
        isArray : false,      // only one name allowed
        icon    : 'ion-android-pin'
      }
    });
    /**
     * the fields that the query will look for
     * @type {string[]}
     * @private
     */
    this._queryFields = ['name', 'telephone', 'location', 'email'];
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
      } else if (typeof _vm._fields[fieldIndex].labels !== 'undefined') {
        if (typeof _vm._fields[fieldIndex].labels === 'string') {
          return _vm._fields[fieldIndex].labels;
        } else {
          return _vm._fields[fieldIndex].labels[0];
        }
        return fieldIndex;
      }
    }

    /***
     * Filter the contacts. If filterVal is a value then this is compared to the
     * defined field list
     *
     * used: http://jsfiddle.net/yoorek/2zt27/1/
     * as example to create promises from the function calls
     */
    return {
      all : function(filterVal) {
        /*
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(_vm.tmpUsers);
        }, 10);

        return deferred.promise;
        */
        return (util.isDefined(filterVal)) ?
          db.all('contact', {value: filterVal, fields: _vm._queryFields}) :
          db.all('contact');
      },
      /**
       * store the data in the db
       * @param data
       * @returns {Promise}
       *
       */
      put : function(data) {
        return db.put(data) ;
      },
      get : function(docId) {
        return db.get(docId);
      },
      /**
       * add a new contact to the store
       * @param data
       * @returns {Promise}
       */
      add : function(data) {
        return db.add(data, 'contact');
      },
      fields : function(cnt) {
        var result = [];
        $log.log('fields');
        return Array.prototype.slice.call(cnt);
      },
      /**
       * return the display name of the contact
       * @param cnt contact retrieved by get
       * @returns string
       */
      caption : function(cnt) {
        return util.isDefined(cnt.name) ? cnt.name[0].value : 'no name';
      },
      /**
       * returns the array of fields to edit in the order
       *   - value
       *   - label
       *   - icon
       *   - format     (to display with dates)
       *
       */
      viewFields : function(data) {
        return util.view(data, _vm._fields);
      },
      /**
       * read the information from contact and put them so jsonForm can handle it
       */
      modelToForm : function(data) {
        return util.dataToModel(data, _vm._fields);
      },
      formToModel : function(data, record) {
        return util.modelToData(data, record, _vm._fields);
      },
      changes : function(newData, orgData) {
        return util.dataChanges(newData, orgData, _vm._fields);
      },
      /**
       * convert the current information into the json form definition
       */
      jsonForm : function() {
        return util.jsonForm(_vm._fields);
      }
    };
  }]);

