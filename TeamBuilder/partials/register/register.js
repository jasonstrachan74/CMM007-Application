angular.module('teamBuilder').controller('registerController', function($scope,$window,$http,$rootScope,$location,$cacheFactory){

  // Set the window title
  $window.document.title='Sports Team Builder';
  
  // Set the url to post to for server side actions
  var url = 'partials/register/register.php';
	
  // Initialise the data object
  $scope.dto = {
	  mode : 'Register',
	  user : {}
  };
  
	// Save the team changes
	$scope.register = function(){
		// Build the data package to submit
		var dtoPackage = { Action:$scope.dto.mode,User:$scope.dto.user };

	  $http.post(url, dtoPackage)
                .success(function (response) {
                   
                  if(response.data) {
                    var profileCache = $cacheFactory.get('profileCache') || $cacheFactory('profileCache'); 
                    profileCache.put('userDetails', response.data);

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