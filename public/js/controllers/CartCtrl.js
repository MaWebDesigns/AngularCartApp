angular.module('CartCtrl', []).controller('CartController', function($scope, $location, Games) {

	$scope.cartData = [];   			// All tickets/orders within the current cart
	$scope.editableRows = [];   		// Keeps track of edit state in each row
	$scope.rowsMarkedForDeletion = [];  // Keeps track of any row that is marked for deletion.  
	$scope.editText = [];				// Text of the "Edit" button for each row (not sure if we need this?)
	$scope.inEditMode = false;  		// Flag that indicates if any row is currently being edited 
	$scope.purchaseName = new Date();	// Name of the purchase
	$scope.cartTotal = 0;				// Total for the entire cart
	
	/************************************************************************
	// getCart
	// Reads in Cart JSON file and itializes the cart.   
	//
	// Returns:  Data - the JSON file data returned.   
	//    
	*/
	Games.getCart().success( function (data)
	{
		// Since there can be mutiple tickets per "order" - we want to
		// break that apart so each "ticket" is in its own row moving forward with
		// all information relavant to that ticket/row. 
		//
		$scope.cartData = [];
		// Check data for errors
		if (typeof(data) === "undefined") 
		{
			console.warn("No Data Returned from JSON");
			return;
		}
		
		/* This needs some more thought - but it works.  The Cart basically has to deal with "tickets"  in two ways.   The first is 
		// forward - where one "order" contains a single "ticket".   Each ticket has all the information needed to be dispyed in the JSON file. 
		// The second is with "multi-ticket" orders, where one "order" contains muptipe tickets.   The tickets share come commen traits like the
		// images, amout of draws, etc.    In this case - we need to loop through each ticket in the order and basically reconstruct it and make it 
		// a standalone object (decoupled with the other tickets in the same order).   When the cart is "Saved"  back to the same JSON file - each 
		// ticket will be in its own seperate JSON object.   
		*/
		for (var i = 0; i < data.length; i++)
		{
			var numMultipliersForOrder = 0;
			$scope.editableRows[i] = false;
			if (typeof(data[i].tickets) === "undefined")  // if no tickets object - the "Order" is the ticket.   
			{
				console.log("Single Ticket Per Order");
				var ticket = new Object();
				ticket.userId = data[i].userId;
				ticket.gameId =  data[i].gameId;
				ticket.gameImg = data[i].gameImg;
				ticket.numbers = data[i].numbers;
				ticket.bonusNumbers = data[i].bonusNumbers;
				ticket.multiplier = data[i].multiplier;
				ticket.multiplierPrice = data[i].multiplierPrice;
				ticket.ticketPrice = data[i].ticketPrice;
				ticket.numberOfDraws = data[i].numberOfDraws;
				ticket.pricePerTicket = data[i].pricePerTicket;
				ticket.group = data[i].group;
				ticket.availableGroups = data[i].availableGroups;
				ticket.options = data[i].options;
				$scope.cartData.push(ticket);
			}
			else 
			{
				console.log("Multiple Tickets Per Order")
				for (var j = 0; j < data[i].tickets.length; j++)
				{
					var ticket = new Object();
					ticket.userId = data[i].userId;
					ticket.gameId =  data[i].gameId;
					ticket.gameImg = data[i].gameImg;
					ticket.numbers = data[i].tickets[j].numbers;
					ticket.bonusNumbers = data[i].tickets[j].bonusNumbers;
					ticket.multiplier = data[i].tickets[j].multiplier;
					ticket.multiplierPrice = data[i].multiplierPrice;
					ticket.ticketPrice = data[i].tickets[j].ticketPrice;
					ticket.pricePerTicket = data[i].pricePerTicket;
					ticket.numberOfDraws = data[i].numberOfDraws;
					ticket.group = data[i].group;
					ticket.availableGroups = data[i].availableGroups;
					ticket.options = data[i].options;
					$scope.cartData.push(ticket);		
				}
			}
		}
		
		// get mutipliers, edit buttons, etc
		for (var i=0; i< $scope.cartData.length; i++)
		{			
			// All rows are unedtable when the JSON file is read.   
			$scope.editableRows.push(false);
			$scope.editText.push('Edit');
		}
		$scope.calculateCartTotal();
	});

	/************************************************************************
	// calculateCartTotal
	// Calculates overall cart value.
	//
	// Inputs: none
	//    
	*/
	$scope.calculateCartTotal = function()
	{
		$scope.cartTotal = 0;
		for (var i = 0; i < $scope.cartData.length; i++)
		{
			$scope.cartTotal = $scope.cartTotal + $scope.cartData[i].ticketPrice;
		}
		console.log("Cart Total = " +  $scope.cartTotal);
		
	}
	
	/************************************************************************
	// editRow
	// Places row in edit state and sets the full cart in EDIT mode.
	//
	// Inputs: row - row we are checking;
	//    
	*/
	$scope.editRow = function(row)
	{
		console.log("in EditRow - row = " + row + " Edit Status for row is " + $scope.editableRows[row] + "Length of Editable Rows is " +  $scope.editableRows.length);
		if ($scope.editableRows[row] == true)
		{
			$scope.editableRows[row] = false;
			$scope.editText[row] = 'Edit';
			$scope.inEditMode = false;
		}
		else
		{
			$scope.editableRows[row] = true;
			$scope.inEditMode = true;
			$scope.editText[row] = 'Modified';
		}
	}
	
	/************************************************************************
	// isInEditMode
	// Getter for $scopeInEditMode.  
	//
	// Inputs: none;
	//    
	*/
	$scope.isInEditMode = function()
	{
		return $scope.inEditMode;
	}
	
	/************************************************************************
	// updateButtonActive
	// If a row is in EDIT, the updateButton for the cart is made active.  
	//
	// Inputs: none 
	*/
	$scope.updateButtonActive = function()
	{
		if ($scope.inEditMode === true) 
		{
			return('btnActive');
		}
		else 
		{
			return('btnDisabled');
		}
	}
	
	/************************************************************************
	// checkoutButtonActive
	// If no edits are in progress, the user is allowed to checkout.   
	//
	// Inputs: none 
	*/
	$scope.checkoutButtonActive = function()
	{
		if ($scope.inEditMode === false) 
		{
			return('btnActive');
		}
		else 
		{
			return('btnDisabled');
		}
	}
	
	
	/************************************************************************
	// markRowForDeletion
	// Marks a row in the cart table for deletion upon an update.  
	//
	// Inputs:  
	//    row - current row 
	//    checkStatus -  should row be deleted
	//    $event -  event data.  
	*/
	$scope.markRowForDeletion = function(row, checkStatus, $event)
	{
		if (checkStatus == true)
		{
			$scope.rowsMarkedForDeletion.push(row);
		}
		else 
		{	
			$scope.rowsMarkedForDeletion.splice(row);
		}
		
		// IF row is not in edit, put it in edit - otherwise, leave it alone.  
		if ($scope.editableRows[row] == false) 
		{
			$scope.editRow(row);
		}
		
	}
	
	/************************************************************************
	// multiplierClicked
	// Callback for when the multiplier checkbox is clicked on a row.   
	// will update the model and prices accordingly
	//
	// Inputs:  
	//    row - current row 
	//    $event -  event data.  
	*/
	$scope.multiplierClicked = function(row, $event)
	{
		console.log("In Multiplier clicked- multiplier = " + $event.currentTarget.checked + " price = " + $scope.cartData[row].multiplierPrice);
		if ($event.currentTarget.checked == true)
		{
			console.log("In Multiplier clicked - on");
			$scope.cartData[row].ticketPrice = $scope.cartData[row].ticketPrice *  $scope.cartData[row].multiplierPrice;
		}
		else
		{
			$scope.cartData[row].ticketPrice = $scope.cartData[row].ticketPrice /  $scope.cartData[row].multiplierPrice;
		}
		$scope.calculateCartTotal();
	}
	
	$scope.drawsChanged = function(row)
	{
		console.log("In Draws Changed - number of draws = " + $scope.cartData[row].numberOfDraws.value + " Price Per Ticket " + $scope.cartData[row].pricePerTicket + " Multiplier = " + $scope.cartData[row].multiplier + " Multiplier Price = " + $scope.cartData[row].multiplierPrice); 
		$scope.cartData[row].ticketPrice = $scope.cartData[row].numberOfDraws.value * $scope.cartData[row].pricePerTicket;
		if ($scope.cartData[row].multiplier)
		{
			$scope.cartData[row].ticketPrice =  $scope.cartData[row].ticketPrice * $scope.cartData[row].multiplierPrice;
		}
		$scope.calculateCartTotal();
	}
	
	/************************************************************************
	// UpdateCart
	// Updates the cart with all edits.  Saves modified data to the 
	// cart JSON file  
	//
	// Inputs:  none;
	//   
	*/
	$scope.updateCart = function()
	{	
		// Reset edit mode
		$scope.inEditMode = false;
		$scope.editableRows = false;
		
		$scope.cartTotal = 0;
		
		if ($scope.rowsMarkedForDeletion.length === $scope.cartData.length)
		{
			console.warn("All Cart Rows are deleted!");
			$scope.cartData = [];
		}
		else 
		{
			for (var i = 0; i < $scope.rowsMarkedForDeletion.length; i++)
			{
				$scope.cartData.splice($scope.rowsMarkedForDeletion[i], 1);
			}
		}
		// Reset the button edit text and total.   
		for (var j=0; j < $scope.cartData.length; j++)
		{
			$scope.editText[j] = "Edit";
			
			$scope.cartTotal += $scope.cartData[j].totalPrice; 
		}
		
		// clear out the edit status and rows for deletion arrays - if the table is 
		// recreated, these arrays will be repacked.   
		$scope.rowsMarkedForDeletion = [];
		$scope.editableRows = [];
		
		$scope.calculateCartTotal();
		// Update the JSON file 
		Games.updateCart("api/updateCart",  $scope.cartData).success(function (data) {
			console.log("Updated Cart");
			// Update based on JSON file
			Games.getCart();	
		});
		
		
	}
	
	/************************************************************************
	// checkout
	// Updates the cart and then proceeds to the checkout page.   
	//
	// Inputs:  none;
	//   
	*/
	$scope.checkout = function()
	{
		$scope.updateCart();  // make sure cart is updated
		// This is a hack - but the Angular is faster than the data being loaded.   
		// a promice on the API side is probably needed. . . .
		$timeout(function() {
			$location.path("/checkout");
		}, 100);
		
	}
	
	/************************************************************************
	// addItems
	// Updates the cart and returns user to the subscriptions page  
	//
	// Inputs:  none;
	//   
	*/
	$scope.addItems = function()
	{
		$scope.updateCart();  // make sure cart is updated
		$location.path("/subscriptions"); // go to subscriptions
	}
	
	/************************************************************************
	// confirmCheckout
	// Proceeds through the final checkout process.     
	//
	// Inputs:  none;
	//   
	*/
	$scope.confirmCheckout = function()
	{
		Games.confirmCheckout("api/confirmCheckout",  $scope.cartData).success(function (data) {
			console.log("Checkout Confirmed");
			// Clear the cartData array and everythig else
			$scope.cartData = [];
			$scope.editableRows = [];   		
			$scope.rowsMarkedForDeletion = [];   
		
			$timeout(function() {
				$location.path("/purchaseform");
			}, 100);

		});
		
	}
})
.directive('cartTable', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/cart_table.html"
	};
})
.directive('purchaseName', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/purchase_name.html"
	};
})
.directive('cartTotal', function() 
{
	return {
		restrict: 'E',
		templateUrl: "views/directives/cart_total.html"
	};
})


;