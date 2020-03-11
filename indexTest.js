const express = require('express');
const { Pool } = require('pg')
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
//app.get('/postalrate', handleRate);

// start the server listening
app.listen(port, function() {
  console.log('Node app is running on port', port);
});

const connectionString = process.env.DATABASE_URL || "postgres://ihhzjlnhwcruop:11914da3ce8765ff885b575530d9b5bddb5f12302862414990c0640303c22ea2@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d3n5sus6t084ko?ssl=true";
const pool = new Pool({connectionString: connectionString});

var sql = "SELECT * FROM some_table_here";

pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows[2]);
});     

pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM some_table_here WHERE id = $1', [1], (err, res) => {
      done()
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })
  });



////////////////////////////////////////////////


var express = require('express');
var router = express.Router();

//pg config
var pg = require('pg');

//Users
//get all users
router.get('/users', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM some_table_here', function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//post user
router.post('/users', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('INSERT INTO some_table_here(username, password) VALUES($1, $2) returning id', [req.body.username, req.body.password], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//get one user
router.get('/users/:id', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM some_table_here WHERE id = $1', [req.params.id], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
// update user
router.put('/users/:id', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    //compare with .compareSync(req.body.data.attributes.password, storedPW)
    client.query('UPDATE users SET some_table_here = $2, password = $3  WHERE id = $1', [req.params.id, req.body.username, req.body.password], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//delete one user
router.delete('/users/:id', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
     console.log(connectionString)
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('DELETE FROM some_table_here WHERE id = $1',[req.params.id], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});

module.exports = router;


 