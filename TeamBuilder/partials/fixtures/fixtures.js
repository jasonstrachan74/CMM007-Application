angular.module('teamBuilder').controller('fixturesController', function($scope,$window,$http){

  // Set the window title
  $window.document.title='STB : Fixtures';
  
  // Set the url to post to for server side actions
  var url = 'partials/fixtures/fixtures.php';
	
  // Initialise the data object
  $scope.dto = {
	  mode : 'Add',
    fixtures : {},
    players : {}
  };
  
	// Get the players for the selected fixture
	$scope.viewPlayers = function(fixtureID){
		// Build the data package to submit
		var dtoPackage = { Action:"GetPlayers", FixtureID:fixtureID };
		
		// Post to the server side code
		$http.post(url, dtoPackage)
                .success(function (response) {
                  // If success...
                  // populate the players object
					        $scope.dto.players = response.data;
                })
                .error(function (data) {
                  // If there is an error
                  //  showError(data);
                });
	};

  // Get all fixtures
  var getAllFixtures = function () {
    // Build the data package to submit
    var dtoPackage = { Action:"Get" };
    
    // Post to the server side code
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

  // Get all fixtures
  getAllFixtures();
});