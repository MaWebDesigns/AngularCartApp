angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
		
		// subscriptions
		.when('/subscriptions', {
			templateUrl: 'views/subscription.html',
			controller: 'SubscriptionController'	
		})
		
		// cart
		.when('/cart', {
			templateUrl: 'views/cart.html',
			controller: 'CartController'	
		})
		
		// checkout
		.when('/checkout', {
			templateUrl: 'views/checkout.html',
			controller: 'CartController'	
		})
		
		// purchase form
		.when('/purchaseform', {
			templateUrl: 'views/purchaseform.html',
			controller: 'CartController'	
		});

	$locationProvider.html5Mode(true);

}]);