angular.module('app')
  .controller('AgendaController', function() {
    var _vm = this;
    this.playlists = [
      { title: 'Reggae new', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  });
