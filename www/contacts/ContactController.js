/**
 *
 */
angular.module('app')
  .controller('ContactController', ['$scope','$log', '$state', 'contact',
                    function($scope, $log, $state, contact) {
    var _vm = this;

    this.contacts = [];


    this.getContacts = function() {
      $log.info('get Contacts');
      return contact.all();

      contact.all().then(function(cnt) {
        return cnt;
      });
     // return this.contacts;
    };
    this.add = function() {
      $log.log('add new contact');
      $state.go('app.contact-new');
    }


    contact.all().then(function(contacts) {
      _vm.contacts = contacts;
    })
   }]);

angular.module('app')
  .controller('ContactDetailController', ['$scope', '$stateParams', '$log', '$state', '$timeout', 'contact', 'util', 'popup',
    function($scope, $stateParams, $log, $state, $timeout, contact, util, popup) {

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

    // ----
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

    this.form = [
      "*"
    ];

    this.model = {};
    this.person = {
      name : 'Jaap o'
    };
    // ----

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
      _vm.workingModel = _vm.model;
      _vm.viewFields = contact.viewFields({});
      _vm.caption = 'new contact';
      _vm.isAdd = true;
    } else {
      $log.error('No $stateParams', $stateParams)
    }

    /**
     * edit the current contact
     */
    this.edit = function() {
      $state.go('app.contact-edit', { contactId : _vm.model._id});
    };

    this.submit = function(form) {
     // $log.info('submitting form: ', form, _vm.workingModel);

      if (form.$valid) {
        var data = contact.formToModel(_vm.workingModel, _vm.model);
        $log.log('Data to store:', data);
        var result = _vm.isAdd ?
          contact.put(data) :
          contact.add(data, 'contact');

        result.then(function() {
          $state.go('app.contact-detail', { contactId : _vm.model._id});
        }).catch(function(err) {
          $log.log(err);
          popup.alert(
            'There was an error saving the information.<br>Error: {error} ({errNo})',
            'Error saving information',
            { '{error}' : err.message,'{errNo}' : String(err.status) });
        });
      } else {
        alert('failed');
      }
    }
  }]);