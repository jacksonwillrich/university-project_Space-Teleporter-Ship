var express = require('express');
var http = require('http');
var engine = require('ejs-mate');

var app = express();
app.engine('ejs', engine);
app.use(express.static('./public/phaser'));

app.set('view engine', 'ejs');
app.set('views', './04/views');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


http.createServer(app)
	.listen(3000, function () {
		console.log('Servidor está no ar. Acesse http://localhost:3000/index.html para jogar');
	});