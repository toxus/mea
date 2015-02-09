angular.module('app')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppController'
      })

      .state('app.agenda', {
        url: "/agenda",
        views: {
          'menuContent': {
            templateUrl: "templates/search.html"
          }
        }
      })

      .state('app.contacts', {
        url: "/contacts",
        views: {
          'menuContent': {
            templateUrl: "contacts/index.html"
          }
        }
      })
      .state('app.contact-detail', {
        url: "/contact/:contactId",
        views: {
          'menuContent': {
            templateUrl: "contacts/view.html"
          }
        }
      })
      .state('app.contact-edit', {
        url :'/contact-edit/:contactId',
        views : {
          'menuContent': {
            templateUrl :'contacts/form.html'
          }
        }
      })
      .state('app.contact-new', {
        url :'/contact-new',
        params: {add : true},
        views : {
          'menuContent': {
            templateUrl :'contacts/form.html'
          }
        }
      })
      .state('init', {
        url : '/init',
        templateUrl: 'templates/init.html'
      })
      .state('app.agendas', {
        url: "/agendas",
        views: {
          'menuContent': {
            templateUrl: "agenda/index.html"
          }
        }
      })

      .state('app.single', {
        url: "/playlists/:playlistId",
        views: {
          'menuContent': {
            templateUrl: "templates/playlist.html",
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/agendas');
  });
