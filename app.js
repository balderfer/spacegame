/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var jade = require('jade');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// Use jade for views
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var MONGOHQ_URL;

if (appEnv.services && appEnv.services['user-provided']) {
  var mongocred = appEnv.services['user-provided'][0].credentials;
  MONGOHQ_URL = "mongodb://" + mongocred.user + ":" + mongocred.password + "@" + mongocred.uri + ":" + mongocred.port + "/spacegame";
} else {
  MONGOHQ_URL = "mongodb://localhost/spacegame";
}

mongoose.connect(MONGOHQ_URL);

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Space Game' });
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
