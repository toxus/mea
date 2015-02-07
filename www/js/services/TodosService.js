angular.module('app')
  .factory('TodosService', function() {
  var todos = [
    {title: "Take out the trash", done: true},
    {title: "Do laundry", done: false},
    {title: "Start cooking dinner", done: false}
  ]

  return {
    todos: todos,
    getTodo: function(index) {
      return todos[index]
    }
  }
})