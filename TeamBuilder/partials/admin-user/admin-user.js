angular.module('teamBuilder').controller('adminUserController', function($scope,$window,$http){

  // Set the window title
  $window.document.title='Sports Team Builder - Admin : Users';
  
  // Set the url to post to for server side actions
  var url = 'partials/admin-user/admin-user.php';
  
  $scope.dto = {
	  mode : 'Add',
	  users : {},
	  user : {}
  };
  

  	// Save the user changes
	$scope.saveUser = function(){
		// Build the data package to submit
		var dtoPackage = { Action:$scope.dto.mode,User:$scope.dto.user };

	  $http.post(url, dtoPackage)
                .success(function (response) {
                    getAllUsers();
                    $scope.dto.mode = 'Add';
  					$scope.dto.user = {};
                })
                .error(function (data) {
                  //  showError(data);
                });
	};
	
	// Display the user to edit
	$scope.editUser = function(user){
		$scope.dto.mode="Edit";
		$scope.dto.user = user;
	};

	// Delete the selected user
	$scope.deleteUser = function(userID){
		// Build the data package to submit
		var dtoPackage = { Action:"Delete",UserID:userID };

		// Post to the server side code
	  $http.post(url, dtoPackage)
                .success(function (response) {
                	// If success...
                    // refresh the users object
                    getAllUsers();
                    $scope.dto.mode = 'Add';
  					$scope.dto.user = {};
                })
                .error(function (data) {
                	// If there is an error
                  //  showError(data);
                });
	};


//cancelAddEdit
$scope.cancelAddEdit = function() {
 $scope.dto.mode = 'Add';
  $scope.dto.user = {};
};

  // Get all users
  var getAllUsers = function () {
  	// Build the data package to submit
	var dtoPackage = { Action:"Get" };

    // Post to the server side code
	$http.post(url, dtoPackage)
                .success(function (response) {
                	// If success...
                    // populate the users object
                    $scope.dto.users = response.data;
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
    };

  // Below here, initialise page content

  // Get all users
  getAllUsers();
});