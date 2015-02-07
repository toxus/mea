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
  .controller('ContactDetailController', ['$scope', '$stateParams', '$log', '$state', 'contact', function($scope, $stateParams, $log, $state, contact) {

    var _vm = this;

    // all fields to show
    this.viewFields = {};
    // the name of the current record
    this.caption = {};
    // the calculate form to edit this contact
    this.jsonForm = contact.jsonForm();

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
      "*",
      {
        type: "submit",
        title: "Save"
      }
    ];

    this.model = {};
    this.person = {
      name : 'Jaap'
    };
    // ----

    if ($stateParams.contactId) {
      $log.info('do it');
      contact.get($stateParams.contactId).then(function(person) {
        _vm.model = person;

        _vm.viewFields = contact.viewFields(person);
        _vm.caption = contact.caption(person);
      })
    } else {
      $log.error('No $stateParams', $stateParams)
    }

    /**
     * edit the current contact
     */
    this.edit = function() {
      //$log.info('switch to edit', _vm.person);
      $state.go('tab.contact-edit', { contactId : _vm.model._id});
    }

    this.onSubmit = function() {
      $log.info('submitting form: ', this.model);
    }
  }]);