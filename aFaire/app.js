//datalayer
var dataLayer = require('./datalayer/dataLayer.js');

var dataUserLayer = require('./datalayer/dataUserLayer.js');

//server web 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//init parser
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); //Dossier des données statics

app.use('/', require('./api-route'));


//Start the application after the database connection is ready
dataLayer.init(function(){
    console.log('init');
    app.listen(3000);
    console.log("Listening on port 3000");
});

dataUserLayer.init(function(){
    console.log('User data initialized');
});

