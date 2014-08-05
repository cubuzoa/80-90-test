var fs                 = require('fs');
var express            = require('express');
var morgan             = require('morgan');
var bodyParser         = require('body-parser');
var methodOverride     = require('method-override');
var mongoose           = require('mongoose');
var utils              = require('./lib/utils');
var app                = express();
var mongooseConnection = utils.connectToDatabase( mongoose );

app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs');
app.set('views',__dirname + '/public/views');
app.use(morgan('dev')); 					
app.use(bodyParser()); 						
app.use(methodOverride()); 	


// Register Models
var modelPath = __dirname + "/models";
fs.readdirSync( modelPath ).forEach( function ( file ) {
    if ( ~file.indexOf( ".js" ) ) require( modelPath + "/" + file )( mongooseConnection );
});

// Register Controllers
var controllerPath = __dirname + "/controllers";
fs.readdirSync( controllerPath ).forEach( function ( file ) {
    if ( ~file.indexOf( "Controller.js" ) ) require( controllerPath + "/" + file )( app, mongooseConnection);
});

app.listen(process.env.PORT);	
console.log('Magic happens on port 8080'); 