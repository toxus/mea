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
    'email' : 'email',
    // contact.form
    'The name is required'  : 'The name is required'
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
    'email' : 'email',
    // contact/form
    'The name is required' : 'De naam is verplicht',
    'Error saving information' : 'Fout bij het opslaan',
    'There was an error saving the information.<br>Error: {error} ({errNo})' : 'De wijziging is niet opgeslagen.<br>Fout: {error} ({errNo})'
  });
  $ionicConfigProvider.backButton.text('');

  $translateProvider.preferredLanguage('nl');
}]);