angular.module('teamBuilder').controller('loginController', function($scope,$window,$http,$rootScope,$location,$cacheFactory){

  // Set the window title
  $window.document.title='Sports Team Builder';
  
  // Set the url to post to for server side actions
  var url = 'partials/login/login.php';
	
  // Initialise the data object
  $scope.dto = {
	  mode : 'Login',
	  user : {}
  };
  
  $scope.goRegister = function() {
    $location.path( "/register" );
  };

	// Save the team changes
	$scope.login = function(){
		// Build the data package to submit
		var dtoPackage = { Action:$scope.dto.mode,User:$scope.dto.user };

	  $http.post(url, dtoPackage)
                .success(function (response) {
                   
                  if(response.data) {
                    var profileCache = $cacheFactory.get('profileCache') || $cacheFactory('profileCache'); 
                    profileCache.put('userDetails', response.data);
                    profileCache.put('teamDetails', response.team);

                     $rootScope.User = response.data;
                     $rootScope.SignedIn = true;
                     $location.path( "/fixtures" );
                 } else {
                    $scope.error = response.error;
                 };

                })
                .error(function (data) {
                  //  showError(data);
                });
	};
});