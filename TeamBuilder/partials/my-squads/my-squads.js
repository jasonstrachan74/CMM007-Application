angular.module('teamBuilder').controller('mySquadController', function($scope,$window,$http,$cacheFactory){

  // Set the window title
  $window.document.title='STB : My Squads';
  
  var url = 'partials/my-squads/my-squads.php';
	
  var profileCache = $cacheFactory.get('profileCache') || $cacheFactory('profileCache'); 
if(profileCache){
  $scope.userDetails = profileCache.get('userDetails');
  $scope.team = profileCache.get('teamDetails');
}

  // Initialise the data object
  $scope.dto = {
	  mode : '',
	  squadDDL : {}
  };
  

  $scope.showJoinNew = function() {
  		$scope.dto.mode = "Join";
  };
	

	$scope.joinTeam = function(){
		dta = { Action:"Join",TeamID:$scope.dto.selectedTeamID, Member_UserID:$scope.userDetails.UserID };
	  $http.post(url, dta)
                .success(function (response) {
                    getMySquads($scope.userDetails.UserID);
                    $scope.dto.mode = "";
                })
                .error(function (data) {
                  //  showError(data);
                });
	};


	$scope.leaveSquad = function(squadmemberID){
		dta = { Action:"Leave",SquadMemberID:squadmemberID };
	  $http.post(url, dta)
                .success(function (response) {
                    getMySquads($scope.userDetails.UserID);
                })
                .error(function (data) {
                  //  showError(data);
                });
	};

  var getMySquads = function (userid) {
	  var dtoPackage = { Action:"Get", UserID:userid };
	  
	  $http.post(url, dtoPackage)
                .success(function (response) {
                    $scope.dto.teams = response.data;
                })
                .error(function (data) {
                  //  showError(data);
                });
    };
	

	  var getAllSquads = function () {
	  var dtoPackage = { Action:"GetAllSquads" };
	  
	  $http.post(url, dtoPackage)
                .success(function (response) {
                    $scope.dto.squadDDL = response.data;
                })
                .error(function (data) {
                  //  showError(data);
                });
    };
	

  // Get all squads the user is a member of
  getMySquads($scope.userDetails.UserID);

  getAllSquads();
});