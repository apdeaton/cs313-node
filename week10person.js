var http = require('http');
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







// Following the "Single query" approach from: https://node-postgres.com/features/pooling#single-query

const { Pool } = require("pg"); // This is the postgres database connection module.

// This says to use the connection string from the environment variable, if it is there,
// otherwise, it will use a connection string that refers to a local postgres DB
const connectionString = process.env.DATABASE_URL || "postgres://ihhzjlnhwcruop:11914da3ce8765ff885b575530d9b5bddb5f12302862414990c0640303c22ea2@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d3n5sus6t084ko?ssl=true";

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// This says that we want the function "getPerson" below to handle
// any requests that come to the /getPerson endpoint
app.get('/getPerson', getPerson);

// Start the server running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// This function handles requests to the /getPerson endpoint
// it expects to have an id on the query string, such as: http://localhost:5000/getPerson?id=1
function getPerson(request, response) {
	// First get the person's id
	const id = request.query.person;

	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getPersonFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			const person = result[0];
            response.status(200).json(person);

            //This will work if you comment out the response above.  It looks like you can 
            //only have ONE response shown for some reason.  
            /*
            response.write("person");
            response.end();
            */
		}
	});
}

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getPersonFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT id, fname, lname, dob FROM person WHERE id = $1::int";

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} // end of getPersonFromDb