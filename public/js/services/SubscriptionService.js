angular.module('SubscriptionCtrl').factory('Games', ['$http', function GamesFactory($http) {
	return {
		getGames:function(gamesUrl) {
			return ( $http({method:"GET", url: gamesUrl}) );
		},
		
		saveItemToCart: function(saveApi, cartInfo) {
			console.log("In Save Item To Cart - saveAPI = " + saveApi + " - Cart Info = " + cartInfo);
			return ( $http({method: "PUT", url: "api/saveCart", data: cartInfo, dataType : "json"} ) );
		}
	} // end return

	
	
	
}]);