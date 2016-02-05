angular.module('SubscriptionCtrl', []).controller('SubscriptionController', function($scope, $location, $timeout, Games) 
{
	
	$scope.gameData = [];						// Details for this game
	$scope.currentGame = this;	    			// Current "game" being shown to the user
	$scope.usersTickets = [];					// Users Ticket selection
	$scope.infoTabSelected = true;				// Is the Info tab currently selected
	$scope.numbersTabSelected = false; 			// Is the Numbers tab currently selected
	$scope.bonusBallTabSelected = false;		// Is the Bonus Ball tab currently selected
	$scope.totalPrice = 0;						// Total Price of this current order
	$scope.userDraws = 0;						// Amout of Draws selected for this ticket/order
	$scope.numberOfTickets = "1";				// How many tickets for this order.
	$scope.activeTicket = 0;					// The "Active" Ticket that is being edited 
	
	
	// this will come from its own API - TBD
	$scope.groups = ["group 1", "group 2", "group 3"];   // Available Groups
	$scope.userGroup = "";								 // Currrent Group
	
	
	/************************************************************************
	// setupGame
	// Initializes the game and resets all class variables to their initial
	// state
	//
	// Inputs: 
	//      game - Current game being displaied.
	//    
	*/
	$scope.setupGame = function(game)
	{
		$scope.currentGame = game;
		$scope.totalPrice = 0;						// Total Price of this current order
		$scope.userDraws = 0;						// Amout of Draws selected for this ticket/order
		$scope.numberOfTickets = "1";				// How many tickets for this order.
		$scope.activeTicket = 0;					// The "Active" Ticket that is being edited 
		$scope.updateTickets();
	}
	
	/************************************************************************
	// showGame
	// Changes the active game to the one that was clicked on
	//
	// Inputs: 
	//      game - game that we are transitioning to.
	//    
	*/
	$scope.showGame = function(clickedGame) {
		$scope.setupGame(clickedGame);
	}
	
	/*************************************************************************** 
	// getLoopNumber()
	// This is a utility function to be able to use ng-repeat for 
	// numbers instead of objects.   ng-repeat only used objects to loop over
	// so this converts numbers into an object for us.   
	//
	// Inputs: 
	//     num - looping number.   
	*/
	$scope.getLoopNumber = function(num) {
		if (!num)
		{
			return;
		}
		num = parseInt(num);
		return new Array(num);
	}
	
	/*************************************************************************** 
	// hideTicket()
	// Hides the current ticket information. 
	//
	// Inputs: 
	//     ticket - ticket to hide  
	*/
	$scope.hideTicket = function(ticket)
	{
		if (ticket === $scope.activeTicket)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	
	/*************************************************************************** 
	// hideTicket()
	// Changes the active ticket to the next one in the list.   
	//
	// Inputs: 
	//     direction - next or previous ticket.   
	*/
	$scope.changeActiveTicket = function(direction)
	{
		if (!direction)
		{
			console.warning("Direction is not defined");
			return;
		}
		else if (direction === "next")
		{
			if ($scope.activeTicket < $scope.numberOfTickets-1)
			{
				$scope.activeTicket++;
			}
		}
		else if (direction === "previous")
		{
			if ($scope.activeTicket > 0)
			{
				$scope.activeTicket--;
			}
		}
	}
	
	/*************************************************************************** 
	// updateTickets
	// When the ticket selector is changed, this function creates the new
    // tickets for the user and clears out any previous non-saved tickets	
	//
	// Inputs: none.  
	//       
	*/
	$scope.updateTickets = function() 
	{
		$scope.usersTickets = [];
		for (var i=0; i< $scope.numberOfTickets;  i++)
		{
			var ticket = new Object(),
			    myNumbers = [],
				bonusNumbers = [],
				ticketPrice = $scope.currentGame.pricePerGame;
			for (var j = 0; j < $scope.currentGame.numberOfPicks; j++)
			{
				var dash = "-";
				myNumbers.push("-");
			}
			for (var k = 0; k < $scope.currentGame.numberOfBonusPicks; k++)
			{
				bonusNumbers.push("-");
			}
			ticket.multiplier = false;
			
			ticket.numbers = myNumbers;
			ticket.bonusNumbers = bonusNumbers; 
			ticket.ticketPrice = ticketPrice;
			$scope.usersTickets.push(ticket);
			
			// Set default Draws for this game. 
			$scope.userDraws = $scope.currentGame.numberOfDrawsAllowed[0];
		}		
	}
	
	/*************************************************************************** 
	// addUserNumbers
	// Add the users-picked numbers to an array specific to the ticket that they
	// are working with 
	//
	// Inputs: 
	//    ticket -  ticket the numbers are being picked for
	//    pickedNumber -  the number the user picked in the current drawpool.
	//       
	*/
	$scope.addUserNumbers = function(ticket, pickedNumber) {
		
		// Loop through and replace the first "-" encountered with the picked number,
		// if all numbers are taken - then just replace the last one with the one picked. 
		for (var i=0; i < $scope.usersTickets[ticket].numbers.length; i++)
		{
			if ($scope.usersTickets[ticket].numbers[i] === "-") 
			{
				$scope.usersTickets[ticket].numbers[i] = pickedNumber.toString();
				break;
			}
			else if ($scope.usersTickets[ticket].numbers[i] === pickedNumber.toString() ) {
				console.warn("Number already selected, removing it from list")
				$scope.usersTickets[ticket].numbers[i] = '-';
				break;
			}
			else if ( i === ($scope.usersTickets[ticket].numbers.length - 1) )
			{
				console.warn("All numbers have been picked");
			}
		}
			
		$scope.usersTickets[ticket].numbers.sort(function(a, b){return a-b});
		$scope.drawUpdated();
		
	}
	
	/*************************************************************************** 
	// addBonusNumbers
	// Add the users selection of the bonus numbers to the selected ticket
	//
	// Inputs: 
	//    ticket -  ticket the numbers are being picked for
	//    pickedNumber -  the number the user picked in the current drawpool.
	//       
	*/
	$scope.addBonusNumber = function(ticket, pickedBonusNumber) {
		for (var i = 0; i < $scope.usersTickets[ticket].bonusNumbers.length; i++)
		{
			$scope.usersTickets[ticket].bonusNumbers[i] = pickedBonusNumber;
		}
	}
	
	/*************************************************************************** 
	// isSelected
	// checks to see if a number has been selected in the current drawpool
	// and changes the class/style of that particular button in the drawpool.   
	//
	// Inputs: 
	//    ticket -  ticket we are checking against
	//    item   -  the number we are checking.
	//       
	*/
	$scope.isSelected = function(ticket, item) 
	{	
		item = item.toString();
		if ($scope.usersTickets[ticket]  === undefined)
		{
			console.warn("usersTickets[ticket] is undefined");
			return;
		}
		
		if ($scope.usersTickets[ticket].numbers.indexOf(item) != -1) 
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
	
	/*************************************************************************** 
	// isBonusSelected
	// checks to see if a number has been selected in the bonus drawpool
	// and changes the class/style of that particular button in the drawpool.   
	//
	// Inputs: 
	//    ticket -  ticket we are checking against
	//    item   -  the number we are checking.
	//       
	*/
	$scope.isBonusSelected = function(ticket,  item) 
	{
		item = item.toString();
		if ($scope.usersTickets[ticket] === undefined)
		{
			console.warn("usersTickets[ticket] is undefined");
			return;
		}
		if ($scope.usersTickets[ticket].bonusNumbers.indexOf(item) != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
	/*************************************************************************** 
	// ticketNumbersChanged
	// Changes the drawpool tab based on the number the user has clicked on 
	// in the ticket input fields.   
	//
	// Inputs: 
	//    ticket -  ticket we are checking against
	//    isBonusNumber -  is the field the user picked a bonus number
	//       
	*/
	$scope.ticketNumbersChanged = function(ticket, isBonusNumber)
	{
		$scope.activeTicket = ticket;
		$scope.infoTabSelected = false;				
		if (isBonusNumber)
		{
			$scope.numbersTabSelected = false; 			
			$scope.bonusBallTabSelected = true;		
		}
		else
		{
			$scope.numbersTabSelected = true; 			
			$scope.bonusBallTabSelected = false;		
		}
	
	}
	
	/*************************************************************************** 
	// quickpickAll 
	// Changes all the current tickets to use quickpick numbers. 
	//
	// Inputs:  None.
	//       
	*/
	$scope.quickpickAll = function()
	{
		for (var i =0; i < $scope.cartData.length; i++)
		{
			$scope.createQuickpick(i);
		}
	}
	
	/*************************************************************************** 
	// createQuickpick 
	// Creates a quickpick for the selected ticket
	//
	// Inputs:  
	//    ticket - ticket the quickpick is for.
	//       
	*/
	$scope.createQuickpick = function(ticket) 
	{
		$scope.clearUserNumbers(ticket);
		$scope.activeTicket = ticket;
		for (var i = 0;  i< $scope.currentGame.numberOfPicks; i++) 
		{
			var randomNum = Math.floor((Math.random() * $scope.currentGame.numberPool) + 1);
			randomNum = randomNum.toString();
			
			// prevent duplicate numbers by checking to see if the random number is already 
			// in the array. 
			if ($scope.usersTickets[ticket].numbers.indexOf(randomNum) < 0)
			{
				$scope.usersTickets[ticket].numbers[i] = randomNum;
			}
			else 
			{
				i--;  // redo the number
			}
		}
		$scope.usersTickets[ticket].numbers.sort(function(a, b){return a-b});
		
		// choose a bonus number
		for (var i = 0;  i< $scope.currentGame.numberOfBonusPicks; i++) 
		{
			var randomNum = Math.floor((Math.random() * $scope.currentGame.bonusNumberPool) + 1);
			randomNum = randomNum.toString();
			// prevent duplicate numbers by checking to see if the random number is already 
			// in the array. 
			if ($scope.usersTickets[ticket].bonusNumbers.indexOf(randomNum) < 0)
			{
				$scope.usersTickets[ticket].bonusNumbers[i] = randomNum;
			}
			else 
			{
				i--;  // redo the number
			}
		}
		$scope.showTabDetails("numbers");
		$scope.drawUpdated();
	}
	
	/*************************************************************************** 
	// clearAllPicks
	// Clears all tickets and resets them to their original state
	//
	// Inputs:  None
	//       
	*/
	$scope.clearAllPicks = function()
	{
		for (var i =0; i < $scope.cartData.length; i++)
		{
			$scope.clearUserNumbers(i);
		}
	}
	
	/*************************************************************************** 
	// clearUserNumbers
	// Clears the numbers of the currently selected ticket
	//
	// Inputs:  
	//    ticket  - ticket to clear the numbers of.   
	//       
	*/
	$scope.clearUserNumbers =  function(ticket) 
	{
		if ( typeof ticket === 'undefined')
		{
			console.warn("No ticket provided for clearUserNumbers");
			return;	
		}
		else 
		{	
			for (var i = 0; i< $scope.currentGame.numberOfPicks; i++) 
			{
				$scope.usersTickets[ticket].numbers[i] = '-';
			}
			
			for (var j = 0; j< $scope.currentGame.numberOfBonusPicks; j++) 
			{
				$scope.usersTickets[ticket].bonusNumbers[j] = '-';
			}
		}
	}
	
	/*************************************************************************** 
	// showTabDetails
	// Show the detailed information of the selected tab
	//
	// Inputs:  
	//    selectedTab - tab to show the details of   
	//       
	*/
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
	
	/*************************************************************************** 
	// isInfoTabSelected
	// returns a boolian showing if the Info tab is currently selected. 
	//
	// Inputs:  
	//    none
	//
	//	Returns:  True if info tab is selected,  False otherwise
	*/
	$scope.isInfoTabSelected = function () {
		return $scope.infoTabSelected;
	}
	
	/*************************************************************************** 
	// isNumbersTabSelected
	// returns a boolian showing if the Numbers tab is currently selected. 
	//
	// Inputs:  
	//    none
	//
	//	Returns:  True if numbers tab is selected,  False otherwise
	*/
	$scope.isNumbersTabSelected = function () {
		return $scope.numbersTabSelected;
	}
	
	/*************************************************************************** 
	// isBonusTabSelected
	// returns a boolian showing if the bonus tab is currently selected. 
	//
	// Inputs:  
	//    none
	//
	//	Returns:  True if bonus tab is selected,  False otherwise
	*/
	$scope.isBonusTabSelected = function () {
		return $scope.bonusBallTabSelected;
	}
	
	/*************************************************************************** 
	// drawUpdated
	// recalculates the tickets price when the number of draws is updated 
	//
	// Inputs:  
	//    None
	//
	*/
	$scope.drawUpdated = function() 
	{
		$scope.totalPrice = 0;
		for (var i=0; i < $scope.usersTickets.length; i++)
		{
			$scope.usersTickets[i].ticketPrice = ($scope.userDraws.value * $scope.currentGame.pricePerGame);
			
			if ($scope.usersTickets[i].multiplier === true)
			{
				$scope.usersTickets[i].ticketPrice = $scope.usersTickets[i].ticketPrice * $scope.currentGame.multiplier.value;
			}
			$scope.totalPrice +=  $scope.usersTickets[i].ticketPrice;
		}	
	}
	
	/*************************************************************************** 
	// addToCart
	// Adds the current tickts to the cart, which is a JSON object.   Calls
	// the SaveItemToCart API which saves the JSON object to a file for 
	// later retrivial by the cart controller.
	//
	// Inputs:  
	//    None
	//
	*/
	$scope.addToCart = function() {
	
		var badNumbers = false, 
			cartData = { 
			'userId' : "TBD12345",
			'gameId' : $scope.currentGame.gameName,
			'gameImg' : $scope.currentGame.gameLogo,
			'tickets' : $scope.usersTickets,
			'multiplierPrice' : $scope.currentGame.multiplier.value,
			'pricePerTicket': $scope.currentGame.pricePerGame,
			'numberOfDraws' : $scope.userDraws,
			'group' : $scope.userGroup,
			'availableGroups': $scope.groups,
			'totalPrice' :  $scope.totalPrice
		};
		
		// Using a label for the loop so I can break out of it easy.   
		ticketLoop: 
			for (var i = 0;  i < cartData.tickets.length; i++)
			{
				for (var j=0; j < cartData.tickets[i].numbers.length; j++)
				{
					if (cartData.tickets[i].numbers[j].indexOf('-') >= 0)
					{
						badNumbers = true;
						break ticketLoop;   // break out of both loops
					}
				}
				for (var j=0; j < cartData.tickets[i].bonusNumbers.length; j++)
				{
					if (cartData.tickets[i].bonusNumbers[j].indexOf('-') >= 0)
					{
						badNumbers = true;
						break ticketLoop;   // break out of both loops
					}
				}
			}
		
		if (badNumbers === true)
		{
			alert("You must fill out all tickets before saving");
		}
		else 
		{
			Games.saveItemToCart("api/saveCart",  cartData).success(function (data) {
				console.log("Saved item to cart");
			
				// This is a hack - but the Angular is faster than the data being loaded.   
				// a promice on the API side is probably needed. . . .
				$timeout(function() {
					$location.path("/cart");
				}, 100);
			});
		}
	}
	
	/*************************************************************************** 
	// getGames
	// Gets the all the game details for the user from a JSON file and then
	// set them up for the user.   
	//
	// Inputs:  
	//    JSON file - the file containing the game details.   
	//
	*/   
	Games.getGames('data/gameDetails.json').success( function (data)
	{
		$scope.gameData = data.games;
		$scope.setupGame($scope.gameData[0]);
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
.directive('multiplier', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/multiplier.html"
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