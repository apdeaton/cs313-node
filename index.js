const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// tell it to use the public directory as one where static files live
app.use(express.static('public'));

// views is directory for all template files
//the first 'views' is telling what they're looking for (which is the views -- this is a node thing),
//and the 2nd parameter ('views', or in this case __dirname +'/views') is the
//directory it is found in
app.set('views', 'views');

//The 'view engine' is a node thing (perhaps) and it specifies it's looking for an ejs file
//This says "the view engine we are going to use for this is ejs"
app.set('view engine', 'ejs');

// set up a rule that says requests to "/math" (form action ) should be handled by the
// handleMath function below
app.get('/postalrate', handleRate);

// start the server listening
app.listen(port, function() {
  console.log('Node app is running on port', port);
});


/**********************************************************************
 * Ideally the functions below here would go into a different file
 * but for ease of reading this example and seeing all of the pieces
 * they are listed here.
 **********************************************************************/

function handleRate(request, response) {
    const mail = request.query.mail;
    const weight = request.query.weight;

	// TODO: Here we should check to make sure we have all the correct parameters

	calculateRate(response, mail, weight);
}

function calculateRate(response, mail, weight) {
	//op = op.toLowerCase();
    var price = 0;

    
	if (mail == "Letters (Stamped)") {
		switch (true) {
            case (weight <= 1):
              price = .55;
              break;
            case (weight > 1 && weight <= 2):
               price = .70;
               break;
            case (weight > 2 && weight <= 3):
               price = .85;
               break;
            case (weight > 3 && weight < 3.5):
                price = 1.00;
                break;
            default:
              price = "No price found, too heavy.  Try a bigger packaging option.";
          }
	} else if (mail == "Letters (Metered)") {
		switch (true) {
            case (weight <= 1):
              price = .50;
              break;
            case (weight > 1 && weight <= 2):
               price = .65;
               break;
            case (weight > 2 && weight <= 3):
               price = .80;
               break;
            case (weight > 3 && weight < 3.5):
                price = .95;
                break;
            default:
                price = "No price found, too heavy.  Try a bigger packaging option.";
          }		
	} else if (mail == "Large Envelopes (Flats)") {
		switch (true) {
            case (weight <= 1):
              price = 1.00;
              break;
            case (weight > 1 && weight <= 2):
               price = 1.20;
               break;
            case (weight > 2 && weight <= 3):
               price = 1.40;
               break;
            case (weight > 3 && weight <= 4):
                price = 1.60;
                break;
            case (weight > 4 && weight <= 5):
              price = 1.80;
              break;
            case (weight > 5 && weight <= 6):
               price = 2.00;
               break;
            case (weight > 6 && weight <= 7):
               price = 2.20;
               break;
            case (weight > 7 && weight <= 8):
                price = 2.40;
                break;
            case (weight > 8 && weight <= 9):
                price = 2.60;
                break;
            case (weight > 9 && weight <= 10):
                price = 2.80;
                break;
            case (weight > 10 && weight <= 11):
                price = 3.00;
                break;
            case (weight > 11 && weight <= 12):
                price = 3.20;
                break;
            case (weight > 12 && weight <= 13):
                price = 3.40;
                break;
            default:
                price = "No price found, too heavy.  Try a bigger packaging option.";
        }	
	} else if (mail == "First-Class Package Service—Retail") {
		switch (true) {
            case (weight <= 1):
              price = 3.80;
              break;
            case (weight > 1 && weight <= 2):
               price = 3.80;
               break;
            case (weight > 2 && weight <= 3):
               price = 3.80;
               break;
            case (weight > 3 && weight <= 4):
                price = 3.80;
                break;
            case (weight > 4 && weight <= 5):
              price = 4.60;
              break;
            case (weight > 5 && weight <= 6):
               price = 4.60;
               break;
            case (weight > 6 && weight <= 7):
               price = 4.60;
               break;
            case (weight > 7 && weight <= 8):
                price = 4.60;
                break;
            case (weight > 8 && weight <= 9):
                price = 5.30;
                break;
            case (weight > 9 && weight <= 10):
                price = 5.30;
                break;
            case (weight > 10 && weight <= 11):
                price = 5.30;
                break;
            case (weight > 11 && weight <= 12):
                price = 5.30;
                break;
            case (weight > 12 && weight <= 13):
                price = 5.90;
                break;
            default:
                price = "No price found, too heavy.  Try a bigger packaging option.";
        }	
    } 
    
	// Set up a JSON object of the values we want to pass along to the EJS result page
	const params = {mail: mail, weight: weight, rate: price};

	// Render the response, using the EJS page "result.ejs" in the pages directory
	// Makes sure to pass it the parameters we need.
	response.render('pages/result', params);

}