/**
 * controller to handle listing and editing of contact
 *
 * version 0.5 jvk 2015.02.10
 *
 */

/**
 * controller for listing all contacts
 */
angular.module('app')
  .controller('ContactController', ['$scope', '$log', '$state', '$timeout', 'contact',
                    function($scope, $log, $state, $timeout, contact) {
    var _vm = this;
    this.contacts = [];
    this.search = '';

    $scope.$watch(angular.bind(this, function(search) {
      return this.search;
    }), function(newVal, oldVal) {
//      $log.log('search changed from/to',oldVal, newVal)
      newVal = newVal.trim();
      var prom = (newVal != '') ? prom = contact.all(newVal) :  prom = contact.all();
      prom.then(function (contacts) {
        _vm.contacts = contacts;
      });
    });


    this.add = function() {
      $log.log('add new contact');
      $state.go('app.contact-new');
    };


    contact.all().then(function(contacts) {
      _vm.contacts = contacts;
    })
  }]);

/**
 * controller of editing and adding a contact
 *
 */
angular.module('app')
  .controller('ContactDetailController', ['$scope', '$stateParams', '$log', '$state', '$timeout', '$translate', '$ionicHistory', 'contact', 'util', 'popup',
    function($scope, $stateParams, $log, $state, $timeout, $translate, $ionicHistory, contact, util, popup) {

    var _vm = this;

    // all fields to show
    this.viewFields = {};
    // the name of the current record
    this.caption = {};
    // the calculate form to edit this contact
    this.jsonForm = contact.jsonForm();
    // the model loaded from the disk
    this.model = {};
    // the model that edited by the form
    this.workingModel = {};
    // if true it an add
    this.isAdd = false;
    // form for order and extra elements
      this.form = [
        "*"
      ];

/*
    this.schema = {
      type: "object",
      properties: {
        'name.0.value' : { type: "string", minLength: '2', title: "Name", placeholder: 'The name'},
        title: {
          type: "string",
          enum: ['dr','jr','sir','mrs','mr','NaN','dj']
        }
      }
    };


    this.model = {};
    this.person = {
      name : 'Jaap o'
    };
*/

    if ($stateParams.contactId) {
      contact.get($stateParams.contactId).then(function(data) {
        _vm.model = data;
        _vm.workingModel = contact.modelToForm(data);
        _vm.viewFields = contact.viewFields(data);
        _vm.caption = contact.caption(data);
        _vm.isAdd = false;
      })
    } else if ($stateParams.add) {
      _vm.model = {};
      _vm.workingModel = {};
      _vm.viewFields = contact.viewFields({});
      _vm.caption = $translate.instant('new contact');
      _vm.isAdd = true;
    } else {
      $log.error('No $stateParams', $stateParams)
      popup.error('There is no state active.');
      $ionicHistory.goBack();
    }

    /**
     * edit the current contact
     */
    this.edit = function() {
      $state.go('app.contact-edit', { contactId : _vm.model._id});
    };

    this.submit = function(form) {

      if (form.$valid) {
        var data = contact.formToModel(_vm.workingModel, _vm.model);
        $log.log('Data to store:', data);
        var result = _vm.isAdd ?
          contact.add(data, 'contact') :
          contact.put(data) ;


        result.then(function() {
          $ionicHistory.goBack();
        }).catch(function(err) {
          $log.log(err);
          popup.alert(
            'There was an error saving the information.<br>Error: {error} ({errNo})',
            'Error saving information',
            { '{error}' : err.message,'{errNo}' : String(err.status) });
        });
      } else {
        popup.error('Please fix the errors');
      }
    }
  }]);