angular.module('app')
  .config(['$translateProvider', '$ionicConfigProvider', function ($translateProvider, $ionicConfigProvider) {
  $translateProvider.translations('en', {
    // menu.html
    'Agenda': 'Agenda',
    //'Contacts and Locations',
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
    'The information has been updated by an other user.' : 'The information has been updated by an other user.',
    // contact.form
    'The name is required'  : 'The name is required',
    'Please fix the errors' : 'Please fix the errors'
  });

  $translateProvider.translations('nl', {
    // menu.html
    'My Agenda': 'Mijn afspraken',
    'Contacts and Locations' : 'Personen en plaatsen',
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
    'The information has been updated by an other user.' : 'De informatie is gewijzigd door een ander',
    // contact/form
    'The name is required' : 'De naam is verplicht',
    'Error saving information' : 'Fout bij het opslaan',
    'There was an error saving the information.<br>Error: {error} ({errNo})' : 'De wijziging is niet opgeslagen.<br>Fout: {error} ({errNo})',
    'Please fix the errors' : 'Niet alle velden zijn juist ingevuld'
  });
  $ionicConfigProvider.backButton.text('');

  $translateProvider.preferredLanguage('nl');
}]);