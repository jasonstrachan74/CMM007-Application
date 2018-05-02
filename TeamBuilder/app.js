var teamBuilder = angular.module('teamBuilder', ['ngRoute']);

teamBuilder.config(function($routeProvider) {
	$routeProvider.
    when('/login', {
      templateUrl: 'partials/login/login.html'
    }).
    when('/fixtures', {
      templateUrl: 'partials/fixtures/fixtures.html'
    }).
    when('/register', {
      templateUrl: 'partials/register/register.html'
    }).
    when('/my-squads', {
      templateUrl: 'partials/my-squads/my-squads.html'
    }).
    when('/my-availability', {
      templateUrl: 'partials/my-availability/my-availability.html'
    }).
    when('/manage-fixtures', {
      templateUrl: 'partials/manage-fixtures/manage-fixtures.html'
    }).
    when('/fixtures', {
      templateUrl: 'partials/fixtures/fixtures.html'
    }).
    when('/admin-user', {
      templateUrl: 'partials/admin-user/admin-user.html'
    }).
	when('/admin-team', {
      templateUrl: 'partials/admin-team/admin-team.html'
    }).
    otherwise({
      redirectTo: '/login'
    });
});

teamBuilder.controller('NavController', function($scope, $rootScope,$cacheFactory){
 // $scope.signedIn = $rootScope.SignedIn;


   $scope.$watch(function() {
    return $rootScope.SignedIn;
}, function() {
  signIn();
}, true);

   var signIn = function() {

      var profileCache = $cacheFactory.get('profileCache') || $cacheFactory('profileCache'); 

      if(profileCache){
        $scope.userDetails = profileCache.get('userDetails');
        $scope.team = profileCache.get('teamDetails');
        if($scope.userDetails){

          $scope.user = $scope.userDetails;
          if ($scope.user) {
            $scope.signedIn  = true;
          }
        }
      }
   };

signIn();
  
});