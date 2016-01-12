angular.module('SubscriptionCtrl', []).controller('SubscriptionController', function($scope, Games) {

	$scope.tagline = 'Welcome to Subscriptions';
	$scope.gameData = [];
	$scope.currentGame = this;	
	$scope.usersGameNumbers = [];
	$scope.usersBonusNumber = "-";
	$scope.infoTabSelected = true;
	$scope.numbersTabSelected = false; 
	$scope.bonusBallTabSelected = false;
	$scope.totalPrice = 0;
	$scope.userDraws = 0;
	
	$scope.setupGame = function(game)
	{
		$scope.currentGame = game;
		$scope.clearUserNumbers();
		console.log("Current Game number of Draws = " +  $scope.currentGame.numberOfDrawsAllowed);
	}
	$scope.showGame = function(clickedGame) {
		$scope.setupGame(clickedGame);
	}
	
	// This is a utility function to be able to use ng-repeat for 
	// numbers instead of objects.   ng-repeat only used objects to loop over
	// so this converts numbers into an object for us.   
	$scope.getLoopNumber = function(num) {
		return new Array(num);
	}
	
	// Add the users numbers to an array.  
	$scope.addUserNumbers = function(event, pickedNumber) {
		console.log("in AddUserNumbers");
		// Loop through and replace the first "-" encountered with the picked number,
		// if all numbers are taken - then just replace the last one with the one picked. 
		for (var i = 0; i < $scope.usersGameNumbers.length; i++) 
		{
			if ($scope.usersGameNumbers[i] === "-") 
			{
				$scope.usersGameNumbers[i] = pickedNumber;
				break;
			}
			else if ($scope.usersGameNumbers[i] === pickedNumber) {
				console.warn("Number already selected, removing it from list")
				$scope.usersGameNumbers[i] = '-';
				break;
			}
			else if ( i === ($scope.usersGameNumbers.length - 1) )
			{
				console.warn("All numbers have been picked");
			}
		}	
		$scope.usersGameNumbers.sort(function(a, b){return a-b});
		console.log($scope.usersGameNumbers);
		
	}
	
	$scope.addBonusNumber = function($event, pickedBonusNumber) {
		console.log("In Add Bonus Number");
		$scope.usersBonusNumber = pickedBonusNumber;
	}
	
	// Check to see if the button has been selected, and if so
	// add a class to it.   
	$scope.isSelected = function(item) 
	{
		if ($scope.usersGameNumbers.indexOf(item) != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// Check to see if the bonus button has been selected, and if so
	// add a class to it.   
	$scope.isBonusSelected = function(item) {
		if ($scope.usersBonusNumber === item) {
			return true;
		}
		else {
			return false;
		}
	}
	
	
	// Creates a "quickpick" ticket.   
	$scope.createQuickpick = function() {
		$scope.clearUserNumbers();
		for (var i = 0;  i< $scope.currentGame.numberOfPicks; i++) {
			var randomNum = Math.floor((Math.random() * $scope.currentGame.numberPool) + 1);
			$scope.usersGameNumbers[i] = randomNum;
		}
		$scope.usersGameNumbers.sort(function(a, b){return a-b});
		
		// choose a bonus number
		$scope.usersBonusNumber = Math.floor((Math.random() * $scope.currentGame.numberPool) + 1);
		
		console.log("After Quickpick -  users numbers = " + $scope.usersGameNumbers);
	}
	
	// Handler when the Clear Picks link is pressed
	$scope.clearPicks = function() {
		console.log("In Clear Picks");
		$scope.clearUserNumbers();
	}
	
	// Clears the user numbers array and resets the buttons.
	$scope.clearUserNumbers =  function() {
		for (var i = 0;  i< $scope.currentGame.numberOfPicks; i++) {
			$scope.usersGameNumbers[i] = '-';
		}
		$scope.usersBonusNumber = '-';
	}
	
	$scope.showTabDetails = function (selectedTab) {
		switch (selectedTab) {
			case "info" : 
				$scope.infoTabSelected = true;
				$scope.numbersTabSelected = false; 
				$scope.bonusBallTabSelected = false;
				break;
			case "numbers": 
				$scope.infoTabSelected = false;
				$scope.numbersTabSelected = true; 
				$scope.bonusBallTabSelected = false;
				break;
			case "bonusBall":
				$scope.infoTabSelected = false;
				$scope.numbersTabSelected = false; 
				$scope.bonusBallTabSelected = true;
				break;
			default: 
				$scope.infoTabSelected = true;
				$scope.numbersTabSelected = false; 
				$scope.bonusBallTabSelected = false;
		}
	}
	
	$scope.isInfoTabSelected = function () {
		return $scope.infoTabSelected;
	}
	
	$scope.isNumbersTabSelected = function () {
		return $scope.numbersTabSelected;
	}
	
	$scope.isBonusTabSelected = function () {
		return $scope.bonusBallTabSelected;
	}
	
	$scope.drawUpdated = function() {
		// calculate new total
		$scope.totalPrice =  $scope.userDraws.value * $scope.currentGame.pricePerGame;
		
	}
	
	$scope.addToCart = function() {
		console.log("In Add To Cart");
		var cartData = [{ 
			'userId' : "TBD12345",
			'gameId' : $scope.currentGame.gameName,
			'gameNumbers' : $scope.usersGameNumbers,
			'bonusBall' : $scope.usersBonusNumber,
			'numberOfDraws' : $scope.userDraws,
			'totalPrice' :  $scope.totalPrice
		}];
		Games.saveItemToCart("api/saveCart",  cartData).success(function (data) {
			console.log("Saved item to cart");
		});
	}
	
	Games.getGames('data/gameDetails.json').success( function (data)
	{
		$scope.gameData = data.games;
		console.log($scope.gameData);
		$scope.setupGame($scope.gameData[0]);
		console.log("Current Game is " + $scope.currentGame.gameName);
	});
	
})
.directive('gameTabs', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/game_tabs.html"
	};
})
.directive('gameDetails', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/game_details.html"
	};
})
.directive('quickpicks', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/quickpicks.html"
	};
})
.directive('addToCart', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/add_to_cart.html"
	};
})
.directive('currency', function () {
    return {
        require: 'ngModel',
        link: function(elem, $scope, attrs, ngModel){
            ngModel.$formatters.push(function(val){
                return '$' + val
            });
            ngModel.$parsers.push(function(val){
                return val.replace(/^\$/, '')
            });
        }
    }
})


;