angular.module('app')
  .config(['$translateProvider', '$ionicConfigProvider', function ($translateProvider, $ionicConfigProvider) {
  $translateProvider.translations('en', {
    // menu.html
    'Agenda': 'Agenda',
    'Contacts' : 'Contacts',
    'Todo'     : 'Todo',
    'Settings' : 'Preference',
    // contacts/index
    'Search' : 'Search',
    // contacts/view
    'Save'  : 'Save',
    'Cancel' : 'Cancel',
    'name'  : 'name',
    'telephone' : 'telephone',
    'email' : 'email'
  });

  $translateProvider.translations('nl', {
    // menu.html
    'Agenda': 'Agenda',
    'Contacts' : 'Contacten',
    'Todo'     : 'Aandachtspunten',
    'Settings' : 'Instellingen',
    // contacts/index
    'Search' : 'Zoeken',
    // contacts/view
    'Save'  : 'Bewaar',
    'Cancel' : 'Annuleer',
    'name'  : 'naam',
    'telephone' : 'telefoon',
    'email' : 'email'
  });
  $ionicConfigProvider.backButton.text('');

  $translateProvider.preferredLanguage('nl');
}]);