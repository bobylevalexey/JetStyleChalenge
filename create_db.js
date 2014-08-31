var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(process.argv[2], function(err){
	if (err){
		console.error('Error. ',err);
		return err;
	}
	db.run("CREATE TABLE IF NOT EXISTS main (" + 
		"title NVARCHAR(50) PRIMARY KEY,"+
		"price DECIMAL(10,2),"+
		"count INT)", function(err){
			if (err){
				if (err.errno == 1){
					console.log("Table already exists.");
					return;
				}
				console.error("Error: Can't create table. ", err);
				return;;
			}
			console.log('Success.');
		});
});