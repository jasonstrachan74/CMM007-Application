angular.module('teamBuilder').controller('myAvailabilityController', function($scope,$window,$http,$cacheFactory){

  // Set the window title
  $window.document.title='STB - My Availability';
  
  // The url to post server requests to
  var url = 'partials/my-availability/my-availability.php';
	
    var profileCache = $cacheFactory.get('profileCache') || $cacheFactory('profileCache'); 
if(profileCache){
  $scope.userDetails = profileCache.get('userDetails');
  $scope.team = profileCache.get('teamDetails');
}

  // Initialise the data object
  $scope.dto = {
	  mode : 'Add'
  };
 	
	// Set the players availability for the fixture
	$scope.setAvailability = function(userID, fixtureID, available, teamsheetID){

    var action = "Set";

    if (teamsheetID!=null) {
      action = "Update";
    };

	  // The data package to be sent server side
	  var dtoPackage = { Action:action,
	  	Availability: {
	  		FixtureID : fixtureID,
	  		Squad_UserID : userID,
	  		Available: available,
        TeamSheetID:teamsheetID
	  	}
	  };

	  //
	  $http.post(url, dtoPackage)
                .success(function (response) {
                    getAllTeamFixtures(userID);
                })
                .error(function (data) {
                  //  showError(data);
                });
	};
	
  $scope.responseStatus = function(available){
    var message = "Not responded";

    if (available==1) {
      message = "Available";
    } else if  (available==0) {
      message = "Not available";
    } 

    return message;
  };

  // Get all fixtures for my teams
  var getAllTeamFixtures = function (userid) {

  	  // The data package to be sent server side
	  var dtoPackage = { Action:"Get", Member_UserID:$scope.userDetails.UserID };
	  
	  // Post to the server side
	  $http.post(url, dtoPackage)
                .success(function (response) {
               	  // Process the response
                  $scope.dto.fixtures = response.data;
                })
                .error(function (data) {
                  // Process the error
                  //  showError(data);
                });
    };

  // Get all fixtures for my teams
  getAllTeamFixtures();
})