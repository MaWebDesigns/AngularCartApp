angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		
		.when('/subscriptions', {
			templateUrl: 'views/subscription.html',
			controller: 'SubscriptionController'	
		});

	$locationProvider.html5Mode(true);

}]);