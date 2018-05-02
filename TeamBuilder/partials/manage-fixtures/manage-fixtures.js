angular.module('teamBuilder').controller('manageFixtureController', function($scope,$window,$http,$cacheFactory){

  // Set the window title
  $window.document.title='STB : Manage : Fixtures';
  
  // Set the url to post to for server side actions
  var url = 'partials/manage-fixtures/manage-fixtures.php';
	
var profileCache = $cacheFactory.get('profileCache') || $cacheFactory('profileCache'); 
if(profileCache){
  $scope.userDetails = profileCache.get('userDetails');
  $scope.team = profileCache.get('teamDetails');
}

  // Initialise the data object
  $scope.dto = {
	  mode : 'Add',
    fixtures: {},
    fixture: {},
    teamsheet: {}
  };
  
  $scope.pickPlayers = function(fixtureID){
    $scope.dto.mode="Pick";
    
    // Build the data package to submit
    var dtoPackage = { Action:$scope.dto.mode,FixtureID:fixtureID };

    $http.post(url, dtoPackage)
                .success(function (response) {
                    // If success...
                    // populate the teamsheet object
                    $scope.dto.teamsheet = response.data;
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
  };

  // Save the player changes
  $scope.pickPlayer = function(fixtureID, teamsheetID, picked){


    // Build the data package to submit
    var dtoPackage = { Action:"PickPlayer",TeamSheetID:teamsheetID,Picked:picked };

    $http.post(url, dtoPackage)
                .success(function (response) {
                    // If success...
                    // refresh the teamsheet object
                    $scope.pickPlayers(fixtureID);
                    //resetPage();
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
  };


// Save the team changes
  $scope.saveFixture = function(){
    if ($scope.dto.mode == "Add") {
      $scope.dto.fixture.TeamID = $scope.team.TeamID;
    };

    // Build the data package to submit
    var dtoPackage = { Action:$scope.dto.mode,Fixture:$scope.dto.fixture };

    $http.post(url, dtoPackage)
                .success(function (response) {
                    // If success...
                    // refresh the fixtures object
                    getAllFixturesForTeam($scope.team.TeamID);
                    resetPage();
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
  };
  
  // Display the fixture to edit
  $scope.editFixture = function(fixture){
    $scope.dto.mode="Edit";
    // Pass a copy rather than a reference
    $scope.dto.fixture = angular.copy(fixture);
  };

  // Delete the selected fixture
  $scope.deleteFixture = function(fixtureID){
    // Build the data package to submit
    var dtoPackage = { Action:"Delete",FixtureID:fixtureID };

  // Post to the server side code
    $http.post(url, dtoPackage)
                .success(function (response) {
                  // If success...
                    // refresh the fixtures object
                    getAllFixturesForTeam($scope.team.TeamID);
                    resetPage();
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
  };
  
//cancelAddEdit
$scope.cancelAddEdit = function() {
 resetPage();
};

// Reset page
var resetPage = function() {
  $scope.dto.mode = 'Add';
  $scope.dto.fixture = {};
};

  // Get all fixture for team
  var getAllFixturesForTeam = function (teamID) {
    // Build the data package to submit
	  var dtoPackage = { Action:"Get",TeamID:teamID };
	  
	  $http.post(url, dtoPackage)
                .success(function (response) {
                    // If success...
                    // populate the fixtures object
                    $scope.dto.fixtures = response.data;
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
    };

  // Below here, initialise page content

  // Get all fixture for team
  getAllFixturesForTeam($scope.team.TeamID);
});