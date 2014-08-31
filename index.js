var express = require('express'),
	app = express(),
	sqlite3 = require('sqlite3'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	dbFile = './mydb.db';

console.log(__dirname + '\\static');

app.use('/static', express.static( __dirname + '\\static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

// запрос главной страницы
app.get('/', function (req, res){
	res.writeHead(200, {'content-type': 'text/html'});
	var templ = fs.createReadStream('./templates/index.html');
	templ.pipe(res);
});

/* запрос на добавление элемента. возвращает true в случае 
успешного добавления, иначе возвращает false */
app.post('/add', function(req, res){
	var jsonReq = req.body;
	var oldCount = jsonReq.count,
		oldPrice = jsonReq.price;
	jsonReq.count = Number(jsonReq.count);
	jsonReq.price = Number(jsonReq.price);
	if (!(jsonReq.price >=0 &&
		jsonReq.count >=0 &&
		oldCount != '' &&
		oldPrice != '' &&
		jsonReq.title.length >0 &&
		parseInt(jsonReq.price*100) == jsonReq.price*100 &&	
		parseInt(jsonReq.count) == jsonReq.count 
	)){
		res.writeHead(200, {'Content-type': 'application/json'});
		res.end(JSON.stringify(false));
		return;
	}
	db.run('INSERT INTO main VALUES (?, ?, ?)', [
		jsonReq.title, 
		jsonReq.price,
		jsonReq.count
	], function (err){
		var jsonRes;
		if (err){
			jsonRes = false;
		} else {
			jsonRes = true;
		}
		res.writeHead(200, {'Content-type': 'application/json'});
		res.end(JSON.stringify(jsonRes));
	});
});

/* запрос на удаление элемента. возвращает true в случае 
успешного добавления, иначе возвращает false */
app.post('/delete', function(req, res){
	db.all('SELECT * FROM main WHERE title=?', [req.body.title], function(err, rows){
		var jsonRes = true;
		if (!err && rows.length){
			db.run('DELETE FROM main WHERE title=?',[req.body.title], function(err){
				if (err)
					jsonRes = false;
				res.writeHead(200, {'Content-type': 'application/json'});
				res.end(JSON.stringify(jsonRes));
			});
		} else {
			res.writeHead(200, {'Content-type': 'application/json'});
			res.end(JSON.stringify(false));
		}
	});
});

// запрос начальных данных, для заполнения таблицы
app.get('/init', function(req, res){
	db.all('SELECT * FROM main;', function(err, rows){
		var jsonResponse;
		if (err){
			jsonResponse['error'] = true;
		} else {
			jsonResponse = rows;
		}
		res.writeHead(200, {'Content-type': 'application/json'});
		res.end(JSON.stringify(jsonResponse));
	})
});


var db = new sqlite3.Database(dbFile, function(err){
	if (err)
		console.error('Error with db.', err);
	else{
		console.log("Server started");
		app.listen(8000);
	}
});