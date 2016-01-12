module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	
	app.put('/api/saveCart', function(req, res) {
		// console.log("Getting to the SaveCart API - req.path = " +  req.path + " - req data " + JSON.stringify(req.body) );
		res.json({message:"Saving to the Cart"});
		
		var fs = require('fs');
		var newCartData = req.body;
		
		try {
			var file =  fs.readFileSync("public/data/subscriptionCart.json");
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
		
		// If file exists, try to append.  If not - create it with the new sata we have.
		if (file) {
			var fileContent = JSON.parse(file);  
			var newCartJson =  fileContent.concat(newCartData);
			var existingCart = new Array();
			existingCart.push(newCartJson);
			var newCart =  JSON.stringify(newCartJson,  null, 2);
			console.log("New cart = " + newCart );
			
			fs.writeFile("public/data/subscriptionCart.json", newCart, function(err) {
				if (err) {
					return console.warn(err);
				}
				console.log("Saving/Appending to file");
			});
		}
		else {
			newCartData = JSON.stringify(newCartData, null, 2);
			fs.writeFile("public/data/subscriptionCart.json", newCartData, function(writeErr) {
				if (writeErr) {
					return console.warn(err);
				}
				console.log("Saving NEW File");
			}); 
		}
	});
	
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

	
};