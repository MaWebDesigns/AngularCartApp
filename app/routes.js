module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	
	app.put('/api/saveCart', function(req, res) 
	{
		// console.log("Getting to the SaveCart API - req.path = " +  req.path + " - req data " + JSON.stringify(req.body) );
		res.json({message:"Saving to the Cart"});
		
		var fs = require('fs');
		var newCartData = req.body;
		
		try 
		{
			var file =  fs.readFileSync("public/data/subscriptionCart.json");
		}
		catch (e) 
		{
			// can only try to handle file does not exist error
			if (e.code === "ENOENT") {
				console.log("File Not Found");
			}
			else {
				throw (e);
			}
		}
		
		// If file exists, try to append.  If not - create it with the new sata we have.
		if (file) 
		{
			var fileContent = JSON.parse(file);  
			var newCartJson =  fileContent.concat(newCartData);
			var existingCart = new Array();
			existingCart.push(newCartJson);
			var newCart =  JSON.stringify(newCartJson,  null, 2);
			console.log("New cart = " + newCart );
			
			fs.writeFile("public/data/subscriptionCart.json", newCart, function(e) {
				if (e) {
					return console.warn(e);
				}
				console.log("Saving/Appending to file");
			});
		}
		else 
		{
			newCartData = JSON.stringify(newCartData, null, 2);
			fs.writeFile("public/data/subscriptionCart.json", newCartData, function(writeErr) 
			{
				if (writeErr) {
					return console.warn(writeErr);
				}
				console.log("Saving NEW File");
			}); 
		}
	});
	
	app.put('/api/updateCart', function(req, res) 
	{
		console.log("Getting to the UpdateCart API - req.path = " +  req.path + " - req data " + JSON.stringify(req.body) );
		res.json({message:"Updating the Cart"});
		
		var fs = require('fs');
		var updatedData = req.body;
		
		try 
		{
			var file =  fs.readFileSync("public/data/subscriptionCart.json");
		}
		catch (e) 
		{
			// can only try to handle file does not exist error
			if (e.code === "ENOENT") 
			{
				console.log("File Not Found");
			}
			else 
			{
				throw (e);
			}
		}
		
		// If file exists, try to append.  If not - create it with the new sata we have.
		updatedData = JSON.stringify(updatedData, null, 2);
		fs.writeFile("public/data/subscriptionCart.json", updatedData, function(writeErr) 
		{
			if (writeErr) {
				return console.warn(writeErr);
			}
			console.log("Saving NEW File");
		}); 
		
	});
	
	app.put('/api/confirmCheckout', function(req, res) 
	{
		res.json({message:"Checkout Confirmed"});
		
		var fs = require('fs'),
		    clearCartData = [], 
		    newCartData = req.body;

		// Clear the subscriptionCart JSON file.   
		var file =  fs.unlinkSync("public/data/subscriptionCart.json");
		
		// Save the order in a new file.   
		try {
			var dateStamp = new Date(),
			    dateString = "-" + dateStamp.getUTCMonth() + "-" +  dateStamp.getUTCDate() + "-" +  dateStamp.getUTCFullYear() 
					+ "-" +  dateStamp.getUTCHours() + "-" +  dateStamp.getUTCMinutes() + "-" +  dateStamp.getUTCSeconds(),
			    orderFile = "public/data/order-" + dateString + ".json"
			    file =  fs.readFileSync(orderFile);
		}
		catch (e) {
			// can only try to handle file does not exist error
			if (e.code === "ENOENT") {
				console.log("File Not Found");
			}
			else {
				throw (e)
			}
		}
		newCartData = JSON.stringify(newCartData, null, 2);
		fs.writeFile(orderFile, newCartData, function(writeErr) {
			if (writeErr) {
				return console.warn(writeErr);
			}
			console.log("New Order Created");
		}); 
		
	});
	
	
	// route to handle all angular requests
	app.get('*', function(req, res) 
	{
		res.sendfile('./public/index.html');
	});
};