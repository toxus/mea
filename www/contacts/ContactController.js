/**
 *
 */
angular.module('app')
  .controller('ContactController', function($scope, $log, contact) {
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

    contact.all().then(function(contacts) {
      _vm.contacts = contacts;
    })
   });

angular.module('app')
  .controller('ContactDetailController', ['$scope', '$stateParams', '$log', '$state', '$timeout', 'contact',
    function($scope, $stateParams, $log, $state, $timeout, contact) {

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
      })
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
      $log.info('submitting form: ', form, _vm.workingModel);

      if (form.$valid) {
        var data = contact.formToModel(_vm.workingModel, _vm.model);
        contact.put(data).then(function() {
          $state.go('app.contact-detail', { contactId : _vm.model._id});
        });
      } else {
        alert('failed');
      }
    }
  }]);