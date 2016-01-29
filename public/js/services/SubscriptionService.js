angular.module('SubscriptionCtrl').factory('Games', ['$http', function GamesFactory($http) {
	return {
		getGames:function(gamesUrl) {
			return ( $http({method:"GET", url: gamesUrl}) );
		},
		
		saveItemToCart: function(saveApi, cartInfo) {
			console.log("In Save Item To Cart - saveAPI = " + saveApi + " - Cart Info = " + cartInfo);
			return ( $http({method: "PUT", url: "api/saveCart", data: cartInfo, dataType : "json"} ) );
		},
		
		updateCart: function(saveApi, cartInfo) {
			console.log("In Save Item To Cart - saveAPI = " + saveApi + " - Cart Info = " + cartInfo);
			return ( $http({method: "PUT", url: "api/updateCart", data: cartInfo, dataType : "json"} ) );
		},
		
		getCart:function() {
			return ( $http({method:"GET", url: 'data/subscriptionCart.json'}) );
		},
		
		confirmCheckout:function(confirmApi, cartInfo) {
			console.log("In confitmCheckout - Order Info = " + cartInfo);
			return ( $http({method: "PUT", url: "/api/confirmCheckout", data: cartInfo, dataType : "json"} ) );
		}
	} // end return
}]);