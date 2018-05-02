angular.module('teamBuilder').controller('adminTeamController', function($scope,$window,$http){

  // Set the window title
  $window.document.title='STB : Admin : Teams';
  
  // Set the url to post to for server side actions
  var url = 'partials/admin-team/admin-team.php';
	
  // Initialise the data object
  $scope.dto = {
	  mode : 'Add',
	  teams : {},
	  team : {}
  };
  
	// Save the team changes
	$scope.saveTeam = function(){
		// Build the data package to submit
		var dtoPackage = { Action:$scope.dto.mode,Team:$scope.dto.team };

	  $http.post(url, dtoPackage)
                .success(function (response) {
                    getAllTeams();
                   $scope.dto.mode = 'Add';
  					$scope.dto.team = {};
                })
                .error(function (data) {
                  //  showError(data);
                });
	};
	
	// Display the team to edit
	$scope.editTeam = function(team){
		$scope.dto.mode="Edit";
		$scope.dto.team = team;
	};

	// Delete the selected team
	$scope.deleteTeam = function(teamID){
		// Build the data package to submit
		var dtoPackage = { Action:"Delete",TeamID:teamID };

	// Post to the server side code
	  $http.post(url, dtoPackage)
                .success(function (response) {
                	// If success...
                    // refresh the users object
                    getAllTeams();
                    $scope.dto.mode = 'Add';
  					$scope.dto.team = {};
                })
                .error(function (data) {
                	// If there is an error
                  //  showError(data);
                });
	};
	
//cancelAddEdit
$scope.cancelAddEdit = function() {
 $scope.dto.mode = 'Add';
  $scope.dto.team = {};
};

  // Get all teams
  var getAllTeams = function () {
    // Build the data package to submit
	var dtoPackage = { Action:"Get" };
	  
    // Post to the server side code
	  $http.post(url, dtoPackage)
                .success(function (response) {
                    // If success...
                    // populate the teams object
                  	$scope.dto.teams = response.data;
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
    };

    var getAllManagers = function () {
    var dtoPackage = { Action:"GetAllManagers" };
    
    $http.post(url, dtoPackage)
                .success(function (response) {
                    $scope.dto.managerDDL = response.data;
                })
                .error(function (data) {
                  //  showError(data);
                });
    };

  // Below here, initialise page content

  // Get all teams
  getAllTeams();

  getAllManagers();
});