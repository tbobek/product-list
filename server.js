// server.js
// where your node app starts

// to make your server on localhost https, follow instructions here: 
// https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node
// openssl command to create the keys: 
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
// init project
var express = require('express');
var bodyParser = require('body-parser');
const http = require('http'); 
const https = require('https'); 
var fs = require('fs');

var app = express(); 
var httpApp = express(); 

//const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
app.use(bodyParser.urlencoded({ extended: true }));


const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
}

httpApp.set('port', process.env.PORT || 80);
httpApp.get("*", function (req, res, next) {
    res.redirect("https://" + req.headers.host + "/" + req.path);
});


 app.set('port', process.env.PORT || 44433);
 app.enable("trust proxy");


 

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

 

// init sqlite db
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  console.log("serialize");
  if (!exists) {
    db.run('CREATE TABLE Products (product TEXT, key TEXT, val TEXT)');
    console.log('New table Products created!');
    
    // insert default dreams
    db.serialize(function() {
      db.run('INSERT INTO Products (product, key, val) VALUES ("Find and count some sheep", "sheep sheep", "boring"), ("Climb a really tall mountain", "steeeep mountain", "exciting"), ("Wash the dishes", "nonono", "forbidden")');
    });
  }
  else {
    console.log('Database "Products" ready to go!');
    db.each('SELECT * from Products', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/scan', function(request, response) {
  response.sendFile(__dirname + '/public/scan.html');
});

app.get('/offline', function(request, response) {
  response.sendFile(__dirname + '/public/offline.html');
});

app.get('/enterdata', function(request, response) {
  response.sendFile(__dirname + '/public/enterdata.html');
});

app.get('/browse', function(request, response) {
  response.sendFile(__dirname + '/public/browse.html');
});

app.get('/locate', function(request, response) {
  response.sendFile(__dirname + '/public/locate.html');
});



// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getProducts', function(request, response) {
  console.log('getproducts');  
  db.all('SELECT * from Products', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});


app.post('/insertProduct', function(request, response) {
  console.log("request: " + request); 
  //db.run(`INSERT INTO Dreams (dream, comment) VALUES (${request})`);  
});

app.use('/images', express.static(__dirname + '/images'));



http.createServer(httpApp).listen(httpApp.get('port'), '0.0.0.0', function() {
  console.log('Express HTTP server listening on port ' + httpApp.get('port'));
});


https.createServer(httpsOptions, app) 
  .listen(app.get('port'), '0.0.0.0', () => {
    console.log('express https server running at ' + app.get('port')); 
  }); 

// http->https redirect based on https://gist.github.com/ryanhanwu/5321302


