(function() {
  'use strict';

  var app = angular.module('contactsApp', []);

  app.controller('contactsController', function($scope, $http) {

    $http.get('http://localhost:3001/api/contacts/1')
      .then(function(response) {
	  console.log(response);
        $scope.contacts = response.data.docs;
      });
    
    $scope.saveContact = function(contact) {
      $http.post('http://localhost:3001/api/contacts', contact)
        .then(function(response) {
		console.log(response);
		
         // $scope.contacts.push(response);
      });
    };

  });
})();
